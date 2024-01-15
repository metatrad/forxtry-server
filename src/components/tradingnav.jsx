import React from 'react'
import { useState, useEffect } from 'react';
import { Link, useNavigate,NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GiNetworkBars } from "react-icons/gi";
import { MdContactSupport } from "react-icons/md";
import { RiGraduationCapFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { BiMoneyWithdraw } from "react-icons/bi";
import { MdMenu } from "react-icons/md";
import { RiLuggageDepositFill } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { PiChartLineFill } from "react-icons/pi";
import { LightModeContext } from '../context/lightModeContext';
import { Divide as Hamburger } from 'hamburger-react'
import { FaAngleRight } from "react-icons/fa6";
import { MdOutlineLogout } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useContext } from 'react';
import { logout } from "../redux/userSlice";
import { toast } from 'react-hot-toast';
import { updateBalance, updateDemoBalance } from "../redux/userSlice";
import io from 'socket.io-client';
import Audiow from "../audio/won.mp3";
import Audiol from "../audio/lost.mp3";
import '../LDM/light.css'
import '../styles/tradingNav.css'

const TradingNav = () => {

  const dispatche = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatche(logout());
    navigate("/");
    toast("Logged out");
  };

  const userData = useSelector(state => state?.user?.userAuth);


  const {dispatch} = useContext(LightModeContext)

  const [showSupport, setShowSupport] = useState(false)

  const handleShowSupport = () =>{
    setShowSupport( prev => !prev )
  }
  const [showSettings, setShowSettings] = useState(false)

  const handleShowSettings = () =>{
    setShowSettings( prev => !prev )
  }

  const [showMb, setShowMb] = useState(false)

  const handleShowMb = () =>{
    setShowMb( !showMb )
  }

  const [expiredDemoTradeId, setExpiredDemoTradeId] = useState(null);
  const userInfoLS = JSON.parse(localStorage.getItem('userInfo')) || {};


  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER_DOMAIN, { transports: ['websocket'] }); 

    // Listen for the expirationTimeReached event
    socket.on('expirationDemoTimeReached', (data) => {
      setExpiredDemoTradeId(data);
      if(data.tradeResult==="Won"){
        dispatch(updateDemoBalance( data.updateprofile.demoBalance ));
        userInfoLS.demoBalance =  data.updateprofile.demoBalance 
        localStorage.setItem('userInfo', JSON.stringify(userInfoLS));
        new Audio(Audiow).play();
        toast.success("Trade won")
      }
      if(data.tradeResult==="Lost"){
        new Audio(Audiol).play();
        toast.failure("Trade Lost")
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return (

    <div className='trading-nav'>

      <div className='dt-nav'>
        <div className="trading-navbar">
            <NavLink to = "/trading"><GiNetworkBars /><p>TRADE</p></NavLink>
            <NavLink to = "/demo"><RiGraduationCapFill /><p>DEMO</p></NavLink>
            <NavLink to = "/account"><FaUser /><p>ACCOUNT</p></NavLink>
            <NavLink to = "/deposit"><RiLuggageDepositFill /><p>DEPOSIT</p></NavLink>
            <NavLink to = "/withdrawal"><BiMoneyWithdraw /><p>WITHDRAW</p></NavLink>
            <NavLink to = "/trades"><BiMoneyWithdraw /><p>TRADES</p></NavLink>
            <div onClick={handleShowSettings}><IoSettings /><p>SETTINGS</p></div>
        </div>

        {
          showSupport&&
        <div className="support">
          <h2><p>Help</p>  <IoMdClose onClick={handleShowSupport}/></h2>
          <Link to ="/faq"><div><BsFillQuestionSquareFill color='#016fd3'/><p>FAQ</p></div></Link>
        </div>
        }

        {
          showSettings &&
          <div className="support settings">
          <h2><p>Settings</p>  <IoMdClose onClick={handleShowSettings}/></h2>
  
            <label htmlFor="language"> Language</label>
            <select name='newPassword' id='newPassword'>
  
              <option value="">eng</option>
              <option value="">eng</option>
              <option value="">eng</option>
              <option value="">eng</option>
              <option value="">eng</option>
              <option value="">eng</option>
              <option value="">eng</option>
              <option value="">eng</option>
              <option value="">eng</option>
              
            </select>
  
            <h5>Templates</h5>
  
            <div className="light mode" onClick={()=> dispatch({type:"LIGHT"}) }><MdLightMode color='#ff8a01'/> Light Mode</div>
            <div className="dark mode" onClick={()=> dispatch({type:"DARK"}) }><MdDarkMode color='#ff8a01'/> Dark Mode</div>
          </div>
        }
        </div>

        <div className="mb-trading-nav">
            <NavLink to = "/userwithdrawal"><RiLuggageDepositFill /></NavLink>
            <NavLink to = "/trading"><PiChartLineFill/></NavLink>
            <NavLink to = "/account"><FaUser /></NavLink>
            <NavLink to = "/userdeposit"><BiMoneyWithdraw /></NavLink>
            {/* <div><IoSettings /></div> */}
            <div onClick={handleShowMb}><MdMenu size={30}/></div>
        </div>
        {
          showMb &&
          <div className={`mb-menu ${showMb ? 'visible' : ''}`}>
          <h4>{userData?.email} <span onClick={handleShowMb}><IoClose/></span></h4>
          <div className='mb-menu-links'>

          {userData?.isAdmin === true && (
            <Link to="/admin"> Admin Dashboard <h6><FaAngleRight/></h6></Link>
          )}
          <Link to="/userdeposit">Deposit history <h6><FaAngleRight/></h6></Link>
          <Link to="/userwithdrawal">Withdrawal history <h6><FaAngleRight/></h6></Link>
          <Link to="/trades">Trade history <h6><FaAngleRight/></h6></Link>
          <Link to="/demoTrades">Demo Trades <h6><FaAngleRight/></h6></Link>
          <div className="light mode mblight" onClick={()=> dispatch({type:"LIGHT"}) }><MdLightMode color='#ff8a01'/> Light Mode</div>
          <div className="dark mode mbdark" onClick={()=> dispatch({type:"DARK"}) }><MdDarkMode color='#ff8a01'/> Dark Mode</div>
          </div>
          <p onClick={handleLogout}><MdOutlineLogout/>Logout</p>
        </div>
        }

    </div>
  )
}

export default TradingNav