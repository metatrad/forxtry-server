import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdRocketLaunch } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { FiCheck } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { logout } from "../redux/userSlice";
import '../LDM/light.css'
import CurrencyFormatter from "../utilities/currencyFormatter";
import { userProfileAction } from "../redux/userSlice";
import "../styles/tradingNav.css";


const TradingTopNav = () => {

  const dispatch = useDispatch()
  useEffect(()=>{
      dispatch(userProfileAction())
  },[dispatch])

  const state = useSelector(state => state?.user);
  const {userLoading, userAppErr, userServerErr, profile } = state

  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    const storedValue = localStorage.getItem('userInfo');
    const parsedValue = storedValue ? JSON.parse(storedValue) : null;
    setUserInfo(parsedValue);
  }, []); 
  
  const balance = useSelector((state) => state?.user?.userAuth?.balance);
  const demoBalance = useSelector((state) => state?.user?.userAuth?.demoBalance);

  const userData = useSelector(state => state?.user?.userAuth);
  const userstate = useSelector(state => state?.user);
  const { userAuth, userUpdate } = userstate

  const navigate = useNavigate();

  const [showAccountSwitch, setShowAccountSwitch] = useState(false);

  const handleShowAccountSwitch = () => {
    setShowAccountSwitch((prev) => !prev);
  };

  let accountRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!accountRef.current.contains(e.target)) {
        setShowAccountSwitch(false);
        setNotification(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    toast("Logged out");
  };

  //notifications
  const [notification, setNotification] = useState()
  const handleNotification = ()=>{
    setNotification(!notification)
  }

  //show bal
  const [bal, setBal] = useState()
  const handleBal = ()=>{
    setBal(!bal)
  }


  return (
    <div className="cover-whole-top-nav">
      <div className="chart-container">

        <div className="trading-topnav">
          <Link to ="/trading"><div className="trading-logo"></div></Link>
          <h5 className="web-text">WEB TRADING PLATFORM</h5>
          <Link to="/deposit">
            <div className="bonus">
              <MdRocketLaunch color="#3b405b" size={30} />{" "}
              <p>Get a 30% bonus on your first deposit</p> <h2>30%</h2>
            </div>
          </Link>
          <div className="right-top-nav">

          <div ref={accountRef} onClick={handleNotification} className="notification">
            <IoIosNotificationsOutline size={23} />
            <div className={`no-notifications ${notification? 'open-notification':'close-notification'}`}>
              <p>No notifications.</p>
            </div>
          </div>

          <div className="account-switch-container">
            <div ref={accountRef}>
              <div className="account-switch" onClick={handleShowAccountSwitch}>
                <FaTelegramPlane className="plane" color="#35cb02"/>
                <div className="live-account">
                  <h6> LIVE ACCOUNT </h6>
                  <p>{bal? "****" : CurrencyFormatter("USD",profile?.balance ?profile?.balance: "0")}</p>
                </div>
                <FaAngleDown
                  className={`icon ${showAccountSwitch ? "expanded" : ""}`}
                />
              </div>
              
                <div className={`account-swicthbox ${showAccountSwitch?'open-account-swicthbox': ''}`}>
                  <div className={`account-switchbox-coat ${showAccountSwitch?'open-account-switchbox-coat': ''}`}>
                  <div className="see">
                    <div className="standard-profit">
                      <FaTelegramPlane color="#35cb02" size={20} />{" "}
                      <h5>
                        STANDARD: <p>+0% profit</p>
                      </h5>{" "}
                    </div>
                    <div onClick={handleBal} className="eye">
                      <IoEye size={15} />
                    </div>
                  </div>
                  <h3>{bal? '******@gmail.com' : userData?.email}</h3>
                  <h6>ID:{bal? '****' : userData._id}</h6>
                  <h2 className="currency-change">
                    <p>Currency: {"USD"}</p>{" "}
                  </h2>
                  <div className="buttons">
                    <Link to="/trading">
                      <div className="switch">
                        <div className="round live">
                          <FiCheck size={12} />
                        </div>
                        <h5>
                          Live account <p>{bal? "****" : CurrencyFormatter("USD",profile?.balance)}</p>
                        </h5>
                      </div>
                    </Link>
                    <Link to="/demo">
                      <div className="switch">
                        <div className="round demo"></div>
                        <h5>
                          Demo account <p>{bal? "****" : CurrencyFormatter("USD",profile?.demoBalance)}</p>
                        </h5>
                      </div>
                    </Link>
                  </div>
                  <p className="logout" onClick={handleLogout}>
                    <MdOutlineLogout />
                    Logout
                  </p>
                  </div>
                </div>
              
            </div>
          </div>

          <div className="buttons">
            <Link to="/deposit">
              <button className="deposit">
                <FaPlus size={14} className="d-plus"/>
                Deposit
              </button>
            </Link>
            <Link to="/withdrawal">
              <button className="withdrawal">Withdrawal</button>
            </Link>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingTopNav;
