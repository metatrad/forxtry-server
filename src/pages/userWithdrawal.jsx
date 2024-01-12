import React from 'react'
import AccountTopNav from "../components/accountTopNav";
import TradingNav from "../components/tradingnav";
import TradingTopNav from "../components/tradingTopNav";
import UserWithdrawalTable from '../components/userWithdrawalTable';
import '../styles/transactions.css'


const Transactions = () => {
  return (
    <div className='transactions-wrapper'>
      <div className="top-nav">
        <TradingTopNav />
      </div>
       <div className='transactions-body-wrapper'>
        <TradingNav/>
        <div className="transactions-body">
            <div className="padding">
            <div className="transactions-body-container">
                <AccountTopNav/>
                <UserWithdrawalTable/>
            </div>
            </div>
        </div>
       </div>
    </div>
  )
}

export default Transactions
