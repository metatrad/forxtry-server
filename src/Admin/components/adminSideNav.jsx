import React,{useState} from 'react'
import '../adminStyles/sideNav.css'
import { NavLink,useNavigate } from 'react-router-dom'
import { RiHomeLine } from "react-icons/ri";
import { GrUserSettings } from "react-icons/gr";
import { GrAtm } from "react-icons/gr";
import { toast } from "react-hot-toast";
import { RiLuggageDepositLine } from "react-icons/ri";
import { MdCurrencyExchange } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import { PiArrowsClockwiseBold } from "react-icons/pi";
import { LuUserCheck } from "react-icons/lu";
import { LuUserX } from "react-icons/lu";
import { Spin as Hamburger } from 'hamburger-react'
import { MdOutlinePendingActions } from "react-icons/md";
import { LuCheckCircle } from "react-icons/lu";
import { AiOutlineUserSwitch } from "react-icons/ai";
import { logout } from '../../redux/userSlice'
import { useDispatch } from "react-redux";;


const AdminSideNav = () => {

  const [showUsers, setShowUsers] = useState()
  const toggleOptions = () => {
    setShowUsers(!showUsers);
  };

  //dep
  const [showDUsers, setShowDUsers] = useState()
  const toggleDOptions = () => {
    setShowDUsers(!showDUsers);
  };

  //with
  const [showWUsers, setShowWUsers] = useState()
  const toggleWOptions = () => {
    setShowWUsers(!showWUsers);
  };

  const dispatche = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatche(logout());
    navigate("/");
    toast("Logged out successfully");
  };

  const [showSide, setShowSide] = useState(false)

  const handleShowSide = () =>{
    setShowSide( !showSide )
  }

  return (
    <div className={`adminSideNav ${showSide ? 'admin-side-visible' : 'admin-side-not-visible'}`}>
      <div className="logo"></div>
      <button onClick={handleShowSide} className='admin-side-nav-menu'><Hamburger size={20}/></button>
      <hr />
      <div className="links">
        <NavLink to = "/admin"><RiHomeLine/><p>DashBoard</p></NavLink>
        <div className='nav-div-user' onClick={toggleOptions}><GrUserSettings/><p>Users <span className={`icon ${showUsers ? "expanded" : ""}`}><FaCaretDown/></span></p></div>
        <div className={`user-admin-side ${showUsers ? 'open' : 'closed'}`}>
        <NavLink to = "/adminusers"><LuUserX/><p>New Users</p></NavLink>
        <NavLink to = "/pendingusers"><AiOutlineUserSwitch/><p>Pending Users</p></NavLink>
        <NavLink to = "/verifiedusers"><LuUserCheck/><p>Verified Users</p></NavLink>
        </div>

        <div className='nav-div-user' onClick={toggleDOptions}><RiLuggageDepositLine/><p>Deposits<span className={`icon ${showDUsers ? "expanded" : ""}`}><FaCaretDown/></span></p></div>
        <div className={`user-admin-side ${showDUsers ? 'open' : 'closed'}`}>
        <NavLink to = "/admindeposit"><MdOutlinePendingActions/><p>Pending deposits</p></NavLink>
        <NavLink to = "/approveddeposit"><LuCheckCircle/><p>Approved deposits</p></NavLink>
        </div>

        <NavLink to = "/admindepositmethod"><MdCurrencyExchange/><p>Deposit Methods</p></NavLink>

        <div className='nav-div-user' onClick={toggleWOptions}><GrAtm/><p>Withdrawals<span className={`icon ${showWUsers ? "expanded" : ""}`}><FaCaretDown/></span></p></div>
        <div className={`user-admin-side ${showWUsers ? 'open' : 'closed'}`}>
        <NavLink to = "/adminwithdrawal"><MdOutlinePendingActions/><p>Peding withdrawals</p></NavLink>
        <NavLink to = "/approvedwithdrawal"><LuCheckCircle/><p>Approved withdrawals</p></NavLink>
        </div>

        <NavLink to = "/admintransactions"><PiArrowsClockwiseBold/><p>Transactions</p></NavLink>

        <NavLink to = "/" onClick={handleLogout}><MdOutlineLogout/><p>Logout</p></NavLink>
      </div>

    </div>
  )
}

export default AdminSideNav
