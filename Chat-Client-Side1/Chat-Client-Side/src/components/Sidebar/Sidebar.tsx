import React, { useState, useEffect } from 'react';
import { Layout, Menu, MenuProps, Typography } from 'antd';
import classes from './Sidebar.module.scss';
import axios from 'axios';
import Conversation from '../Conversation/Conversation';

const { Sider } = Layout;
const { Text } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key): MenuItem {
  return {
    key,
    label,
  } as MenuItem;
}

type Users = {
  _id: string;
  name: string;
  email: string;
};

type OnlineUsers = {
  userId: string;
  socketId: string;
};

type IProps = {
  socket?: any;
  setSelectedUser: any;
  setConversationId: any;
  conversationId: any;
};

const Sidebar: React.FC<IProps> = ({
  socket,
  setSelectedUser,
  setConversationId,
  conversationId,
}) => {
  const [users, setUsers] = useState<Users[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [allConversation, setAllConversation] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsers[]>([]);
  const userID = sessionStorage.getItem('chat_user_id');
  const items: MenuItem[] = users
    .filter((item: any) => item._id !== userID)
    .map((item) => {
      return getItem(item.name, item._id);
    });

  const ConversationItem: MenuItem[] = allConversation.map(
    (item: any, index: number) => {
      const userID = sessionStorage.getItem('chat_user_id');
      const friend = item.members.find((it: any) => it !== userID);
      const friendDetails = users.find((user) => user._id === friend);
      return friendDetails
        ? getItem(friendDetails?.name, friendDetails?._id)
        : getItem('No Items Found', 'ajay' + index);
    }
  );

  const onlineUsersItems = onlineUsers.map((user, index) => {
    const getUserName: any = users.find((u) => u._id === user.userId);
    return getUserName
      ? getItem(getUserName?.name, getUserName?._id)
      : getItem('No Items Found', 'ajay' + index);
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get('/api/get-users');
        setUsers(data.data);
      } catch (err) {
        console.log(err);
      }
    };

    const getConversation = async () => {
      try {
        const data = await axios.get('/api/conversation');
        setAllConversation(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversation();
    fetchData();
  }, [conversationId]);

  const handleClick: MenuProps['onClick'] = async (e) => {
    try {
      const response = await axios.post(`/api/conversation/new/${e.key}`);
      setConversationId(response.data._id);
      setSelectedUser(e.key);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    socket?.on('getUsers', (users: any) => {
      setOnlineUsers(users);
    });
  }, [socket]);

  // // console.log(
  // //   'online user',
  // //   onlineUsersItems.filter(
  // //     (user: any) => user.key != sessionStorage.getItem('chat_user_id')
  // //   )
  // );

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className={classes.logo}>Chatting</div>
      <div style={{ marginBottom: '15px' }}>
        <Text style={{ color: 'white', padding: '5px', fontWeight: 'bolder' }}>
          All Conversation
        </Text>
        <Menu
          theme='dark'
          defaultSelectedKeys={['1']}
          mode='inline'
          items={ConversationItem}
          onClick={handleClick}
          style={{ textTransform: 'capitalize' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <Text style={{ color: 'white', padding: '5px', fontWeight: 'bolder' }}>
          Online Users
        </Text>
        <Menu
          theme='dark'
          defaultSelectedKeys={['1']}
          mode='inline'
          items={onlineUsersItems.filter(
            (user: any) => user.key != sessionStorage.getItem('chat_user_id')
          )}
          onClick={handleClick}
          style={{ textTransform: 'capitalize' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <Text style={{ color: 'white', padding: '5px', fontWeight: 'bolder' }}>
          All Users
        </Text>
        <Menu
          theme='dark'
          defaultSelectedKeys={['1']}
          mode='inline'
          items={items}
          onClick={handleClick}
          style={{ textTransform: 'capitalize' }}
        />
      </div>
    </Sider>
  );
};

export default Sidebar;
