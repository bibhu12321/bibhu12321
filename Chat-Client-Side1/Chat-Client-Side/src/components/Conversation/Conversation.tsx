import React, { useEffect, useState } from 'react';
import { Layout, Menu, MenuProps } from 'antd';
import axios from 'axios';

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

type IProps = {
  item: any;
};

type UserInterface = {
  _id: String;
  name: String;
  email: String;
  createdAt: String;
  updatedAt: String;
};

const Conversation: React.FC<IProps> = ({ item }) => {
  const [user, setUser] = useState<UserInterface>();

  useEffect(() => {
    const userID = sessionStorage.getItem('chat_user_id');
    const friend = item.members.find((it: any) => it !== userID);
    const fetchUser = async (id: string) => {
      try {
        const response = await axios.get(`/api/getUserById/${id}`);
        setUser(response.data.user);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser(friend);
  }, []);

  const handleClick = () => {};
  return <div>{user?.name}</div>;
};

export default Conversation;
