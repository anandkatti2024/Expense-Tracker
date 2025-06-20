import React ,{useState} from 'react'
import { Form,Input,message} from 'antd'
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios'
import Spinner from '../components/Spinner';
import './styles/Register.css';

const Register = () => {
    const navigate=useNavigate();
    const [loading,setLoading]=useState(false);
     const submitHandler=async (values)=>{
        try{
            setLoading(true)
            await axios.post('/users/register',values);
            message.success('Registration Successful');
            setLoading(false)
            navigate('/login')
        }catch(error){
            setLoading(false)
            message.error('Invalid username or password');
        }
     };

  return (
    <>
      <div className="register-container">
        {loading && <Spinner/>}
        <Form layout='vertical' onFinish={submitHandler} className="register-form">
          <h1 className="register-title">Register Form</h1>
          <Form.Item label="Name" name="name">
            <Input className="register-input" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" className="register-input" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" className="register-input" />
          </Form.Item>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Link to="/login" className="register-link">Already Registered? Click here to Login</Link>
            <button className="register-btn">Register</button>
          </div>
        </Form>
      </div>
    </>
  )
}

export default Register;
