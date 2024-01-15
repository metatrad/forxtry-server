import React from 'react'
import '../adminStyles/sideNav.css'
import { Link,NavLink,useNavigate } from 'react-router-dom'
import { RiHomeLine } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { TbCircleArrowDownLeftFilled } from "react-icons/tb";
import { TbCircleArrowUpRightFilled } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";
import { PiArrowsClockwiseBold } from "react-icons/pi";
import { RiCoinsFill } from "react-icons/ri";
import { LightModeContext } from '../../context/lightModeContext';
import { useContext } from 'react';
import { logout } from '../../redux/userSlice'
import { useDispatch } from "react-redux";;


const AdminSideNav = () => {

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
        <NavLink to = "/adminusers"><FaUsers/><p>Users management</p></NavLink>
        <NavLink to = "/admindeposit"><TbCircleArrowUpRightFilled/><p>Deposits</p></NavLink>
        <NavLink to = "/admindepositmethod"><RiCoinsFill/><p>Deposit Method</p></NavLink>
        <NavLink to = "/adminwithdrawal"><TbCircleArrowDownLeftFilled/><p>Withdrawals</p></NavLink>
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
