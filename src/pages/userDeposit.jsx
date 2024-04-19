import React from 'react'
import AccountTopNav from "../components/accountTopNav";
import UserDepositTable from '../components/userDepositstable';
import TradingNav from "../components/tradingnav";
import TradingTopNav from "../components/tradingTopNav";
import '../styles/transactions.css'


const Transactions = () => {
  return (
    <div className='transactions-wrapper'>
      <div className="top-nav">
        <TradingTopNav />
      </div>
       <div className='transactions-body-wrapper'>
       <div className="trades-side-nav-dw"> <TradingNav/></div>
        <div className="transactions-body">
            <div className="padding">
            <div className="transactions-body-container">
                <AccountTopNav/>
                <UserDepositTable/>
            </div>
            </div>
        </div>
       </div>
    </div>
  )
}

export default Transactions
