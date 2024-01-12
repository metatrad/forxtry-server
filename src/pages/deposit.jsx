import React from "react";
import { useSelector } from "react-redux";
import TradingNav from "../components/tradingnav";
import TradingTopNav from "../components/tradingTopNav";
import { PiCurrencyBtcFill } from "react-icons/pi";
import Depositcard from "../components/depositcard";
import DepositFooter from "../components/depositFooter";
import AccountTopNav from "../components/accountTopNav";
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import "../styles/deposit.css";

const Deposit = () => {
  const depositData = useSelector((state) => state.method.methodList);
  const depositCardList = depositData.slice();

  //categories depositmethods
  const depositCardListCryptocurrencies = depositData.filter(el => el,[]) 

  const loadingArray = new Array(1).fill(null)
  
  return (
    <div>
      <div className="check">
        <div className="tradingNav">
          <TradingTopNav />
         
        </div>
      </div>

      <div className="tradingnav-deposit">
        <TradingNav />
        <div className="deposit-body-wrapper">
        <div className="payment-methods-wrapper">
        <div><AccountTopNav/></div>
        <div className="payment-methods">
        <h1><PiCurrencyBtcFill /> Select a method to make your deposit</h1>
        <div className="crypto methods">
          {depositCardListCryptocurrencies[0] ?
            depositCardListCryptocurrencies.map((el) => {
              return (
                <Depositcard
                  key={el._id}
                  id={el._id}
                  image={el.image}
                  name={el.name}
                  number={el.number}
                  user={el.user}
                  description={el.description}
                />
              );
            })
          :loadingArray.map(el=>{
            return(
              <Depositcard/>
            )
          })
          }
        </div>

        </div>
          <DepositFooter/>
        </div>
        </div>
      </div>
      <TawkMessengerReact propertyId="6596407f0ff6374032bbfebd" widgetId="1hj9ensqv"/>
    </div>
  );
};

export default Deposit;




