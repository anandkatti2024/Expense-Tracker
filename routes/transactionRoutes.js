const express=require('express');
const { addTransaction, getAllTransaction ,editTransaction,deleteTransaction} = require('../controllers/transactionctrl');
const authMiddleware = require('../middleware/authMiddleware');

const router=express.Router();

router.post('/add-transaction', authMiddleware, addTransaction)
router.post('/edit-transaction', authMiddleware, editTransaction)
router.post('/delete-transaction', authMiddleware, deleteTransaction)
router.post('/get-transactions', authMiddleware, getAllTransaction)


module.exports=router