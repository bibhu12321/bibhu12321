import { Button, message, Form, Input, Card, Typography } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Text, Link: Anchor } = Typography;

type IProps = {
  socket: any;
};

const Register: React.FC<IProps> = ({ socket }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState<String>('');

  const onFinish = async () => {
    message.success('Submit success!');
    try {
      const { data } = await axios.post('/api/register', formData);

      setError('');
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
            label='Name'
            name='name'
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input name='name' value={formData.name} onChange={handleChange} />
          </Form.Item>

          <Form.Item
            label='Email'
            name='Email'
            rules={[{ required: true, message: 'Please input your email!' }]}
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
          {error && <Text type='danger'>{error}</Text>}
          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type='primary' htmlType='submit'>
              Create Account
            </Button>
          </Form.Item>
          <Text>Already a user? </Text>
          <Link to={'/login'}>
            <Text style={{ color: 'blue' }}>Sign In</Text>
          </Link>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
