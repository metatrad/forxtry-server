import React,{useState} from 'react'
import '../adminStyles/sideNav.css'
import { Link,NavLink,useNavigate } from 'react-router-dom'
import { RiHomeLine } from "react-icons/ri";
import { GrUserSettings } from "react-icons/gr";
import { GrAtm } from "react-icons/gr";
import { toast } from "react-hot-toast";
import { RiLuggageDepositLine } from "react-icons/ri";
import { MdCurrencyExchange } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import { PiArrowsClockwiseBold } from "react-icons/pi";
import { RiCoinsFill } from "react-icons/ri";
import { LightModeContext } from '../../context/lightModeContext';
import { LuUserCheck } from "react-icons/lu";
import { LuUserX } from "react-icons/lu";
import { AiOutlineUserSwitch } from "react-icons/ai";
import { useContext } from 'react';
import { logout } from '../../redux/userSlice'
import { useDispatch } from "react-redux";;


const AdminSideNav = () => {

  const [showUsers, setShowUsers] = useState()

  const toggleOptions = () => {
    setShowUsers(!showUsers);
  };

  const {dispatch} = useContext(LightModeContext)

  const dispatche = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatche(logout());
    navigate("/");
    toast("Logged out successfully");
  };

  return (
    <div className='adminSideNav'>
      <div className="logo"></div>
      <hr />
      <div className="links">
        <NavLink to = "/admin"><RiHomeLine/><p>DashBoard</p></NavLink>

        <div className='nav-div-user' onClick={toggleOptions}><GrUserSettings/><p>Users <span className={`icon ${showUsers ? "expanded" : ""}`}><FaCaretDown/></span></p></div>
        <div className={`user-admin-side ${showUsers ? 'open' : 'closed'}`}>
        <NavLink to = "/adminusers"><LuUserX/><p>New Users</p></NavLink>
        <NavLink to = "/pendingusers"><AiOutlineUserSwitch/><p>Pending Users</p></NavLink>
        <NavLink to = "/verifiedusers"><LuUserCheck/><p>Verified Users</p></NavLink>
        </div>

        <NavLink to = "/admindeposit"><RiLuggageDepositLine/><p>Deposits</p></NavLink>
        <NavLink to = "/admindepositmethod"><MdCurrencyExchange/><p>Deposit Methods</p></NavLink>
        <NavLink to = "/adminwithdrawal"><GrAtm/><p>Withdrawals</p></NavLink>
        <NavLink to = "/admintransactions"><PiArrowsClockwiseBold/><p>Transactions</p></NavLink>
        <NavLink onClick={handleLogout}><MdOutlineLogout/><p>Logout</p></NavLink>
      </div>
      <h5>THEMES</h5>
      <div className="themes">
        <div className="dark" onClick={()=> dispatch({type:"DARK"}) }></div>
        <div className="light" onClick={()=> dispatch({type:"LIGHT"}) }></div>
      </div>
    </div>
  )
}

export default AdminSideNav
