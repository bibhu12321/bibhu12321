import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  MessageOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { Form, MenuProps, message, Input, Button } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import classes from './Main.module.scss';
import Message from '../UI/Message/Message';
import HeaderComponent from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import axios from 'axios';
const { Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

interface IProps {
  socket: any;
}
interface Users {
  socketID: string;
  userName: string;
}

export type IMessage = {
  senderID: string;
  senderName: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
};
const Main: React.FC<IProps> = ({ socket }) => {
  const [conversationId, setConversationId] = useState<String>('');
  const [selectedUser, setSelectedUser] = useState('');
  const [messageText, setMessageText] = useState<string | number>('');
  const [users, setUsers] = useState<Users[]>([]);
  const [chats, setChats] = useState<IMessage[]>([]);
  const [arrivalMessage, setArrivalMessage] = useState<IMessage>();
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [typingStatus, setTypingStatus] = useState<boolean>(false);
  const [typingStatus1, setTypingStatus1] = useState<boolean>(false);

  const [chatUserId, setChatUserId] = useState<string>(JSON.stringify(sessionStorage.getItem('chat_user_id')));
  const [id, setId] = useState<string>("");
  const lastMessageRef = useRef<any>(null);

  const [form] = Form.useForm();
  const chatUser = sessionStorage.getItem('chat_user');
  //const chatUserId = sessionStorage.getItem('chat_user_id');

  const onFinish = async () => {
    socket?.emit('sendMessage', {
      senderId: chatUserId,
      senderName: chatUser,
      receiverId: selectedUser,
      text: messageText,
    });
    try {
      const newMessage = {
        conversationId: conversationId,
        senderID: chatUserId,
        senderName: chatUser,
        text: messageText,
      };
      socket?.on('getMessage',{
        senderId: chatUserId,
      senderName: chatUser,
      receiverId: selectedUser,
      text: messageText,
      })
      
      console.log(conversationId);
      
      const response = await axios.post(`/api/new-message/`, newMessage);
      setChats([...chats, response.data]);
    } catch (err) {
      console.log(err);
    }
    setMessageText('');
  };

  const onFinishFailed = () => {
    message.error('Submit failed!');
  };

  const onFill = () => {
    form.setFieldsValue({
      url: 'https://taobao.com/',
    });
  };

  const handleTyping = (event:any, eventType:any, id:any) => {
    setId(id)
    console.log("sessionId",id);
    console.log("sessionchatId",chatUserId);
    
    if(eventType === "down"){
      socket.emit('typing',{typingState:true,selectedUser})
    }
    else{
      setTimeout(() => {
        socket.emit('typing',{typingState:false,selectedUser})
      }, 30000);
    }
  };

  useEffect(() => {
    const fetchChats = async (convoId: String) => {
      if (convoId) {
        try {
          const response = await axios.get(`/api/messages/${convoId}`);
          setChats(response.data);
        } catch (err) {
          console.log('some error', err);
        }
      } else {
        setChats([]);
      }
    };
    fetchChats(conversationId);
  }, [conversationId]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  useEffect(() => {
    socket?.on('getMessage', (message: IMessage) => {
      const msg = {
        senderID: message?.senderID,
        senderName: message?.senderName,
        text: message.text,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setArrivalMessage(msg);
    });

    socket?.on("displayTypingStatus", (typingState:any) => {
      if(typingState === true){
        setTypingStatus(typingState);
        console.log("typingState",typingStatus);  
      }
      else{
        console.log("typingState",typingStatus);  
        setTypingStatus(typingState);
      }
    })
    
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage && selectedUser) {
      setChats((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar
        socket={socket}
        setSelectedUser={setSelectedUser}
        setConversationId={setConversationId}
        conversationId={conversationId}
      />
      <Layout className={classes.site_layout}>
        <HeaderComponent socket={socket} />
        <Content style={{ margin: '0 16px', position: 'relative' }}>
          {/* <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className={classes.site_layout_background}>
            <div className={classes.messageContainer}>
              {conversationId ? (
                chats.map((chat, index) => {
                  const type = chatUserId === chat.senderID;
                  return (
                    <div key={index} ref={lastMessageRef}>
                      <Message type={type} chat={chat} />
                    </div>
                  );
                })
              ) : (
                <div className={classes.notChatContainer}>
                  {' '}
                  <p className={classes.notchatMessage}>
                    Select Any Conversation to Start Chatting
                  </p>
                </div>
              )}
            </div>
            
            { (typingStatus) && ( chatUserId !== id)  ? <div>{`${chatUser}' is typing'`}</div> : ''}
            
          </div>
          <div className={classes.chatboxContainer}>
            <Form
              form={form}
              layout='vertical'
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete='off'
            >
              <div className={classes.sendArea}>
                <Input
                  size='large'
                  placeholder='Enter Message'
                  prefix={<MessageOutlined />}
                  value={messageText}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setMessageText(e.target.value)
                  }
                  onKeyDown={(event)=>handleTyping(event,"down", chatUserId)}
                  onKeyUp={(event)=>handleTyping(event,"up", chatUserId)}
                />
                <Button
                  onClick={onFinish}
                  type='primary'
                  shape='circle'
                  icon={<SendOutlined />}
                  size={'large'}
                />
              </div>
            </Form>
          </div>
        </Content>
        {/* <Footer style={{ textAlign: "center" }}>
          Chatting App ©2022 Created by Ajay Gangwar
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default Main;
