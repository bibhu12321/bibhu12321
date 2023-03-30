import { Button, message, Form, Input, Card, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SOCKET_URL } from '../../App';

const { Text, Link: Anchor } = Typography;
interface IProps {}
const Login: React.FC<IProps> = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState<String>('');
  const navigate = useNavigate();

  const onFinish = async () => {
    message.success('Submit success!');
    // localStorage.setItem("chat_user", formData.name as string);

    try {
      const { data } = await axios.post(
        '/api/login',
        // socket.emit('newUser', { userName: formData.email as string, socketID: socket.id });
        formData
      );

      setError('');
      sessionStorage.setItem('chat_token', data.token);
      sessionStorage.setItem('chat_user', data.name);
      sessionStorage.setItem('chat_user_id', data.id);
      navigate('/');
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError(err.message);
      }
    }
  };

  const onFinishFailed = () => {
    message.error('Submit failed!');
  };

  const onFill = () => {
    form.setFieldsValue({
      url: 'https://taobao.com/',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Card style={{ width: 500 }}>
        <Form
          form={form}
          layout='vertical'
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item
            label='Email'
            name='Email'
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              name='email'
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item
            label='Password'
            name='password'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              name='password'
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type='primary' htmlType='submit'>
              Login
            </Button>
          </Form.Item>
          {error && <Text>{error}</Text>}
          <Text>Don't have a account? </Text>
          <Link to={'/register'}>
            <Text style={{ color: 'blue' }}>Create Account</Text>
          </Link>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
