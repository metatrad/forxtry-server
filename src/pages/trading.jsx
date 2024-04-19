import React from 'react'
import TradingNav from '../components/tradingnav';
import { Link, useNavigate,NavLink } from "react-router-dom";
import { GoPerson } from "react-icons/go";
import TradingTopNav from '../components/tradingTopNav';
import TradingWidget from '../components/tradingWidget';
import Tradebtns from '../components/trade-btns';
import "../styles/trading.css"


const Trading = () => {
  return (
    <div>
        <div className='check'>
          <div className="tradingNav">
              <TradingTopNav/>
          </div>
        </div>
      <div className="trading-section">
      <div className='tradingnav'>
        <TradingNav/>
      </div>
      <div className='widget'>
        {/* <div className="market-closed">Market closed</div> */}
        <TradingWidget/>
        <Tradebtns/>
      </div>
      <Link to="/account"><div className="account-person"><GoPerson/></div></Link>
      </div>
    </div>
  )
}

export default Trading;
