import React from 'react'
import { useState } from 'react';
import { Link, useNavigate,NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CiBank } from "react-icons/ci";
import { IoSchoolOutline } from "react-icons/io5";
import { GoPerson } from "react-icons/go";
import { TbHelpSquareRounded } from "react-icons/tb";
import { CiViewList } from "react-icons/ci";
import { RiBankCardLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { BiMoneyWithdraw } from "react-icons/bi";
import { MdContactSupport } from "react-icons/md";
import { RiLuggageDepositFill } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { PiChartLineFill } from "react-icons/pi";
import { LightModeContext } from '../context/lightModeContext';
import { FaAngleRight } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { Spin as Hamburger } from 'hamburger-react'
import { CiLogout } from "react-icons/ci";
import { SlSettings } from "react-icons/sl";
import { PiPresentationChartThin } from "react-icons/pi";
import Logo from '../images/logoL.PNG'
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

  const [showSupportMb, setShowSupportMb] = useState(false)

  const handleShowSupportMb = () =>{
    setShowSupportMb( !showSupportMb )
  }

  const [showMb, setShowMb] = useState(false)

  const handleShowMb = () =>{
    setShowMb( !showMb )
  }

  return (

    <div className='trading-nav'>

      <div className='dt-nav'>
        <div className="trading-navbar">
            <div><img src={Logo} alt="Logo"/></div>
            <div onClick={handleShowSupport}><TbHelpSquareRounded/><p>SUPPORT</p></div>
            <NavLink to = "/trading"><PiPresentationChartThin /><p>TRADE</p></NavLink>
            <NavLink to = "/demo"><IoSchoolOutline /><p>DEMO</p></NavLink>
            <NavLink to = "/trades"><CiViewList /><p>TRADES</p></NavLink>
            <NavLink to = "/demotrades"><CiViewList /><p>DEMO TRADES</p></NavLink>
            <NavLink to = "/account"><GoPerson /><p>ACCOUNT</p></NavLink>
            <NavLink to = "/userdeposit"><CiBank /><p>DEPOSIT HISTORY</p></NavLink>
            <NavLink to = "/userwithdrawal"><RiBankCardLine /><p>WITHDRAWAL HISTORY</p></NavLink>
            <div onClick={handleShowSettings}><SlSettings /><p>SETTINGS</p></div>
            <div onClick={handleLogout}><CiLogout color='#336ecd'/><p>LOG OUT</p></div>
        </div>

        <div className={showSupport? 'support': 'no-support'}>
          <h2><p>Help</p>  <IoMdClose onClick={handleShowSupport}/></h2>
          <div><Link to ="https://t.me/+okSu0B6i-2UwYTY0"><FaTelegramPlane className='support-t' color='#fff'/></Link><p>Reach out to us on telegram</p></div>
        </div>

          <div className={ `settings ${showSettings? 'support' : 'no-support'}`}>
          <h2><p>Settings</p>  <IoMdClose onClick={handleShowSettings}/></h2>
  
            <label htmlFor="language"> Language</label>
            <select name='newPassword' id='newPassword'>
              <option value="">eng</option>
            </select>
{/*   
            <h5>Templates</h5>
  
            <div className="light mode" onClick={()=> dispatch({type:"LIGHT"}) }><MdLightMode color='#ff8a01'/> Light Mode</div>
            <div className="dark mode" onClick={()=> dispatch({type:"DARK"}) }><MdDarkMode color='#ff8a01'/> Dark Mode</div> */}
          </div>
        
        </div>

        {/* <div className="mb-trading-nav">
            <div onClick={handleShowSupportMb}><MdContactSupport/></div>
            <NavLink to = "/userwithdrawal"><RiLuggageDepositFill /></NavLink>
            <NavLink to = "/trading"><PiChartLineFill/></NavLink>
            <NavLink to = "/account"><FaUser /></NavLink>
            <NavLink to = "/trades"><IoBarChart/></NavLink>
            <NavLink to = "/userdeposit"><BiMoneyWithdraw /></NavLink>
            <div onClick={handleShowMb}><Hamburger size={24}/></div>
        </div> */}
    
          <div className={`mb-menu ${showSupportMb ? 'visible' : 'not-visible'}`}>
          <div className='support-mb'><Link to ="https://t.me/+okSu0B6i-2UwYTY0"><FaTelegramPlane className='support-mb-t' color='#fff'/></Link><h1>Reach out to us on telegram</h1></div>
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
          <div className="light mode mblight" onClick={()=> dispatch({type:"TOGGLE"}) }><MdLightMode color='#ff8a01' size={35}/></div>
          </div>
          <p onClick={handleLogout}>Logout</p>
        </div>
        

    </div>
  )
}

export default TradingNav
