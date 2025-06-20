import React,{useState,useEffect} from 'react'
import { Modal,Input,Form, Select,Button, message, Table ,DatePicker} from 'antd'
import Layout from '../components/Layout/Layout'
import {UnorderedListOutlined,AreaChartOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons'
import axios from 'axios';
import Spinner from '../components/Spinner';
import moment from 'moment'
import Analytics from '../components/Analytics';
import './styles/Homepage.css';
const { RangePicker } = DatePicker;
const Homepage = () => {

  const [showModal,setshowModal]=useState(false)
  const [loading,setloading]=useState(false);
  const [allTransaction,setallTransaction]=useState([])
  const [frequency,setFrequency]=useState('7')
  const [selectedDate,setSelectedDate]=useState([])
  const [type,setType]=useState('all')
  const [viewData,setViewData]=useState('table')
  const [editable,setEditable]=useState(null)
  const [form] = Form.useForm();
  const column=[
    {
      title:'Date',
      dataIndex:'date',
      key:'date',
      render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>
    },
    {
      title:'Amount',
      dataIndex:'amount',
      key:'amount',
      render: (text) => text
    },
    {
      title:'Type',
      dataIndex:'type',
      key:'type',
      render: (text) => text
    },
    {
      title:'Category',
      dataIndex:'category',
      key:'category',
      render: (text) => text
    },
    {
      title:'Reference',
      dataIndex:'reference',
      key:'reference',
      render: (text) => text
    },
    {
      title:'Actions',
      key:'actions',
      render: (text,record) => (
        <div>
          <EditOutlined onClick={()=>{
            setEditable(record)
            setshowModal(true)
          }}/>
          <DeleteOutlined className='mx-2' onClick={()=>{
            handleDelete(record)
          }}/>
        </div>
      )
    },
  ]
       const getAllTransactions=async()=>{
    try{
      const user=JSON.parse(localStorage.getItem('user'))
      setloading(true);
      const res=await axios.post('/transactions/get-transactions',{userid:user._id,frequency,selectedDate,type});
      setloading(false)
      const transactionsWithKeys = res.data.map(transaction => ({
        ...transaction,
        key: transaction._id,
      
      }));
      setallTransaction(transactionsWithKeys)
    }
    catch(error){
      console.log(error)
      message.error('Fetch Issue with Transaction')
    }
  };

  useEffect(()=>{
 
    getAllTransactions();
  },[frequency,selectedDate,type])

  // Calculate total income and expense
  const totalIncome = allTransaction.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
  const totalExpense = allTransaction.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
  const availableBalance = totalIncome - totalExpense;

  const handleDelete=async (record)=>{
    try{
      setloading(true)
      await axios.post('/transactions/delete-transaction',{transactionId:record._id} )
      setloading(false)
      message.success('Tranaction Deleted!')
      await getAllTransactions();
    }catch(error){
      setloading(false)
      console.log(error)
      message.error('unable to delete')
    }
  }
  const handleSubmit=async (values)=>{
      try{
        const user=JSON.parse(localStorage.getItem('user'))
        setloading(true)
    if (editable) {
     await axios.post('/transactions/edit-transaction', {
     payload: {
      ...values,
      userId: user._id
     },
     transactionId: editable._id
   });
    await getAllTransactions(); 
    setloading(false);
    message.success('Transaction Updated Successfully'); 
}

        else{
        await axios.post('/transactions/add-transaction',{...values,userid:user._id})
        
        setloading(false)
        message.success('Transaction Added Successfully')
        await getAllTransactions();
        }
        setshowModal(false)
        setEditable(null)
      }catch(errror){
        setloading(false)
        message.error('failed to add transaction')
      }
  }

  return (
    <Layout>
      {loading &&<Spinner/>}
      <div className="homepage-container">
        <h1 className="homepage-title">Expense Tracker</h1>
        {/* Available Balance Box */}
        <div style={{
          background: availableBalance < 0 ? '#fff3cd' : '#e6ffed',
          color: availableBalance < 0 ? '#856404' : '#155724',
          border: availableBalance < 0 ? '1px solid #ffeeba' : '1px solid #b7eb8f',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '1.2rem',
        }}>
          Available Balance: ₹{availableBalance}
          {availableBalance < 0 && (
            <div style={{ color: '#856404', marginTop: '0.5rem', fontWeight: 'normal', fontSize: '1rem' }}>
              Warning: Your expenses exceed your income!
            </div>
          )}
          {availableBalance > 0 && (
            <div style={{ color: '#155724', marginTop: '0.5rem', fontWeight: 'normal', fontSize: '1rem' }}>
              Great! Your income is higher than your expenses.
            </div>
          )}
        </div>
        <div className="filters">
                <div>
        <h6>Select Frequency</h6>
        <Select value={frequency} onChange={(values)=>setFrequency(values)}>
          <Select.Option value="7">LAST 1 Week</Select.Option>
            <Select.Option value="30">LAST 1 Month</Select.Option>
              <Select.Option value="365">LAST 1 Year</Select.Option>
                <Select.Option value="custom">Custom</Select.Option>
                  
        </Select>
        {frequency==='custom' &&( <RangePicker value={selectedDate} onChange={(values)=>setSelectedDate(values)}/>)}
        </div>
        <div>
        <h6>Select Type</h6>
        <Select value={type} onChange={(values)=>setType(values)}>
          <Select.Option value="all">All</Select.Option>
            <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
               
                  
        </Select>
        {frequency==='custom' &&( <RangePicker value={selectedDate} onChange={(values)=>setSelectedDate(values)}/>)}
        </div>
              <div className='switch-icon'>
          <UnorderedListOutlined className={`mx-2 ${viewData ==='table'?'active-icon':'inactive-icon'}`} onClick={()=>setViewData('table')}/>
          <AreaChartOutlined className={`mx-2 ${viewData ==='analytics'?'active-icon':'inactive-icon'}`}  onClick={()=>setViewData('analytics')}/>
        </div>

        <div>
          <button className="add-transaction-btn" onClick={() => {
            setEditable(null);
            form.resetFields();
            setshowModal(true);
          }}>Add New</button>
        </div>
        </div>
        <div className="transaction-list">
          {viewData==='table' ?  <Table 
            columns={column} 
            dataSource={allTransaction}
            rowKey="_id"/>
          :<Analytics allTransaction={allTransaction}/>}
        </div>
      </div>

      <Modal title={editable?'Edit Tranaction':'Add Transction'}
      open={showModal} 
      onCancel={()=>setshowModal(false)}
      footer={false}>
       <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={editable}>
        <Form.Item label="Amount" name="amount">
          <Input type="text"/>
        </Form.Item>
        <Form.Item label="type" name="type">
          <Select>
            <Select.Option value="income">
              Income
            </Select.Option>
            <Select.Option value="expense">
              Expense
            </Select.Option>
          </Select>
        </Form.Item>
           <Form.Item label="Category" name="category">
          <Select>
            <Select.Option value="salary">Salary</Select.Option>
            <Select.Option value="project">Project</Select.Option>
            <Select.Option value="investment">Investment </Select.Option>
            <Select.Option value="scholarship">Scholarship</Select.Option>
            <Select.Option value="parttime">Part-time Job</Select.Option>
            <Select.Option value="internship">Internship</Select.Option>
            <Select.Option value="bonus">Bonus</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
            <Select.Option value="stipend">Stipend</Select.Option>
            <Select.Option value="food">Food</Select.Option>
            <Select.Option value="movie">Moveis </Select.Option>
            <Select.Option value="bills">Bills</Select.Option>
            <Select.Option value="fees">Fees</Select.Option>
            <Select.Option value="tax">Tax</Select.Option>
            <Select.Option value="books">Books</Select.Option>
            <Select.Option value="stationery">Stationery</Select.Option>
            <Select.Option value="transport">Transport</Select.Option>
            <Select.Option value="hostel">Hostel</Select.Option>
            <Select.Option value="cafeteria">Cafeteria</Select.Option>
            <Select.Option value="supplies">Supplies</Select.Option>
            <Select.Option value="medical">Medical</Select.Option>
            <Select.Option value="training">Training</Select.Option>
            <Select.Option value="conference">Conference</Select.Option>
            <Select.Option value="uniform">Uniform</Select.Option>
            <Select.Option value="equipment">Equipment</Select.Option>
          </Select>
        </Form.Item>
         <Form.Item label="Date" name="date">
          <Input type='date'/>
         </Form.Item>
         <Form.Item label="Reference" name="reference">
          <Input type='text'/>
         </Form.Item>
         <Form.Item label="Description" name="description">
          <Input type='text'/>
         </Form.Item>
   
         <div className="d-flex justify-content-end">
          <button type="submit" className='btn btn-primary'>Save</button>
         </div>
       
       </Form>
      </Modal> 
      
    </Layout>
  )
}

export default Homepage
