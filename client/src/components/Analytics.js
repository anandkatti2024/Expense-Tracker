import React from 'react'
import { Progress } from 'antd'
const Analytics = ({allTransaction}) => {

    const categories=[
      'salary','project','investment','scholarship','parttime','internship','bonus','freelance','stipend',
      'food','movie','bills','fees','tax','books','stationery','transport','hostel','cafeteria','supplies','medical','training','conference','uniform','equipment'
    ];

    const totalTransaction=allTransaction.length
    const totalIncomeTransactions=allTransaction.filter(transaction=> transaction.type==='income')
    const totalExpenseTransactions=allTransaction.filter(transaction=> transaction.type==='expense')
    const totalIncomepercent = totalTransaction === 0 ? 0 : (totalIncomeTransactions.length / totalTransaction) * 100;
    const totalExpensepercent = totalTransaction === 0 ? 0 : (totalExpenseTransactions.length / totalTransaction) * 100;

    const totalTurnover=allTransaction.reduce((acc,transaction)=>acc+transaction.amount,0);
    const totalIncomeTurnover=allTransaction.filter(
        transaction=>transaction.type==='income'
    ).reduce((acc,transaction)=>acc+transaction.amount,0)

    const totalExpenseTurnover=allTransaction.filter(
        transaction=>transaction.type==='expense'
    ).reduce((acc,transaction)=>acc+transaction.amount,0)

    const totalIncomeTurnoverpercent = totalTurnover === 0 ? 0 : (totalIncomeTurnover / totalTurnover) * 100;
    const totalExpenseTurnoverpercent = totalTurnover === 0 ? 0 : (totalExpenseTurnover / totalTurnover) * 100;
     return (
        <>
    <div className ='row m-3'> 
            <div className="col-md-4">
                <div className="card">
                    <div className="card-header">
                        Total Tranaction:{totalTransaction}
                    </div>
                    <div className="card-body">
                        <h5 className='text-success'>Income:{totalIncomeTransactions.length}</h5>
                        <h5 className='text-danger'>Expense:{totalExpenseTransactions.length}</h5>
                        <div>
                            <Progress type="circle" strokeColor={'green'} className='mx-2' 
                            percent={totalIncomepercent.toFixed(0)}/>
                            <Progress type="circle" strokeColor={'RED'} className='mx-2' 
                            percent={totalExpensepercent.toFixed(0)}/>
                        </div>
                    </div>
                </div>
            </div>
                   <div className="col-md-4">
                <div className="card">
                    <div className="card-header">
                        Total TurnOver:{totalTurnover}
                    </div>
                    <div className="card-body">
                        <h5 className='text-success'>Income:{totalIncomeTurnover}</h5>
                        <h5 className='text-danger'>Expense:{totalExpenseTurnover}</h5>
                        <div>
                            <Progress type="circle" strokeColor={'green'} className='mx-2' 
                            percent={totalIncomeTurnoverpercent.toFixed(0)}/>
                            <Progress type="circle" strokeColor={'red'} className='mx-2' 
                            percent={totalExpenseTurnoverpercent.toFixed(0)}/>
                        </div>
                    </div>
                </div>
            </div>
    </div>
    <div className="row mt-3">
        <div className="col-md-4">
            <h4>Categorywise Income</h4>
            {
                categories.map(category=>{
                    const amount=allTransaction.filter(transaction=>transaction.type==='income' && transaction.category===category).reduce((acc,transaction)=>acc+transaction.amount,0);
                    return(
                        amount>0 && (
                        <div className="card">
                            <div className="card-body">
                                <h5>{category}</h5>
                                <Progress
                                 percent={totalIncomeTurnover === 0 ? 0 : ((amount/totalIncomeTurnover)*100).toFixed(0)}/>
                            </div>
                        </div>
                        )
                        
                    )
                })
            }
        </div>
                    <div className="col-md-4">
            <h4>Categorywise Expense</h4>
            {
                categories.map(category=>{
                    const amount=allTransaction.filter(transaction=>transaction.type==='expense' && transaction.category===category).reduce((acc,transaction)=>acc+transaction.amount,0);
                    return(
                        amount>0 && (
                        <div className="card">
                            <div className="card-body">
                                <h5>{category}</h5>
                                <Progress
                                 percent={totalExpenseTurnover === 0 ? 0 : ((amount/totalExpenseTurnover)*100).toFixed(0)}/>
                            </div>
                        </div>
                        )
                        
                    )
                })
            }
        </div>
    </div>
    </>
  )
}

export default Analytics
