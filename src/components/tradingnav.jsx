import React from 'react'
import { useState, useEffect } from 'react';
import { Link, useNavigate,NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GiNetworkBars } from "react-icons/gi";
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
import { FaAngleRight } from "react-icons/fa6";
import { Spin as Hamburger } from 'hamburger-react'
import { IoBarChart } from "react-icons/io5";
import { useContext } from 'react';
import { logout } from "../redux/userSlice";
import { toast } from 'react-hot-toast';
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

  return (

    <div className='trading-nav'>

      <div className='dt-nav'>
        <div className="trading-navbar">
            <NavLink to = "/trades"><BiMoneyWithdraw /><p>TRADES</p></NavLink>
            <NavLink to = "/trading"><GiNetworkBars /><p>TRADE</p></NavLink>
            <NavLink to = "/demo"><RiGraduationCapFill /><p>DEMO</p></NavLink>
            <NavLink to = "/account"><FaUser /><p>ACCOUNT</p></NavLink>
            <NavLink to = "/deposit"><RiLuggageDepositFill /><p>DEPOSIT</p></NavLink>
            <NavLink to = "/withdrawal"><BiMoneyWithdraw /><p>WITHDRAW</p></NavLink>
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
            <NavLink to = "/trades"><IoBarChart/></NavLink>
            <NavLink to = "/account"><FaUser /></NavLink>
            <NavLink to = "/userdeposit"><BiMoneyWithdraw /></NavLink>
            {/* <div><IoSettings /></div> */}
            <div onClick={handleShowMb}><Hamburger size={24}/></div>
        </div>
    
          <div className={`mb-menu ${showMb ? 'visible' : 'not-visible'}`}>
          <h4 className=''>{userData?.email}</h4>
          <div className='mb-menu-links'>

          {userData?.isAdmin === true && (
            <Link to="/admin"> Admin Dashboard <h6><FaAngleRight/></h6></Link>
          )}
          <Link to="/userdeposit">Deposit history <h6><FaAngleRight/></h6></Link>
          <Link to="/userwithdrawal">Withdrawal history <h6><FaAngleRight/></h6></Link>
          <Link to="/trades">Trades <h6><FaAngleRight/></h6></Link>
          <Link to="/demoTrades">Demo Trades <h6><FaAngleRight/></h6></Link>
          {/* <div className="light mode mblight" onClick={()=> dispatch({type:"LIGHT"}) }><MdLightMode color='#ff8a01'/> Light Mode</div>
          <div className="dark mode mbdark" onClick={()=> dispatch({type:"DARK"}) }><MdDarkMode color='#ff8a01'/> Dark Mode</div> */}
          </div>
          <p onClick={handleLogout}>Logout</p>
        </div>
        

    </div>
  )
}

export default TradingNav
