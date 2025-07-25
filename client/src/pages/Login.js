import React,{useState,useEffect} from 'react'
import { Form,Input,message} from 'antd'
import { Link,Navigate,useNavigate } from 'react-router-dom';
import axios from 'axios'
import Password from 'antd/es/input/Password';
import Spinner from '../components/Spinner';
import './styles/Login.css';

const Login = () => {
        const [loading,setLoading]=useState(false);
        const navigate=useNavigate();
        const submitHandler= async(values)=>{
        try{
            setLoading(true)
            const {data}=await axios.post('/users/login',values);
            setLoading(false)
            message.success('Login Successful');
            // Store token and user in localStorage
            localStorage.setItem('user',JSON.stringify({...data.user, password: ""}));
            localStorage.setItem('token', data.token);
            navigate('/')
        }catch(error){
            setLoading(false)
            message.error('something went wrong')
        }
     };

  return (
    <>
      <div className="login-container">
        {loading && <Spinner/>}
        <Form layout='vertical' onFinish={submitHandler} className="login-form">
          <h1 className="login-title">Login Form</h1>
          <Form.Item label="Email" name="email">
            <Input type="email" className="login-input" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" className="login-input" />
          </Form.Item>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Link to="/register" className="login-link">Not a user? Click here to Register</Link>
            <button type="submit" className="login-btn">Login</button>
          </div>
        </Form>
      </div>
    </>
  )
}

export default Login
