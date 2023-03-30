import React, { useEffect, useState, useRef } from 'react';
import classes from './App.module.scss';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Main from './components/Main/Main';
import socketIO from 'socket.io-client';
import axios from 'axios';

export const SOCKET_URL = 'ws://localhost:8000';
export const SERVER_URL = 'http://localhost:8000';

const App = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState<any>(null);
  const token = sessionStorage.getItem('chat_token');

  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  axios.defaults.baseURL = SERVER_URL;

  const setSocketData = () => {
    const socket = socketIO.connect(SOCKET_URL);
    setSocket(socket);
    const chat_user_id = sessionStorage.getItem('chat_user_id');
    socket.emit('addUser', chat_user_id);
  };
  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      setSocketData();
    }
  }, [token]);

  return (
    <div className='space-align-container'>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register socket={socket} />} />
        <Route path='/' element={<Main socket={socket} />} />
      </Routes>
    </div>
  );
};

export default App;
