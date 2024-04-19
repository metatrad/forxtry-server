import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LiaUser } from "react-icons/lia";
import { FaPlus } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { CiBank } from "react-icons/ci";
import { IoExitOutline } from "react-icons/io5";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { RiBankCardLine } from "react-icons/ri";
import { RiAdminLine } from "react-icons/ri";
import { PiTelegramLogoLight } from "react-icons/pi";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-hot-toast";
import { FcAreaChart } from "react-icons/fc";
import { HiOutlineChartBarSquare } from "react-icons/hi2";
import { logout } from "../redux/userSlice";
import CurrencyFormatter from "../utilities/currencyFormatter";
import { userProfileAction } from "../redux/userSlice";
import "../styles/tradingNav.css";

const TradingTopNav = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userProfileAction());
  }, [dispatch]);

  const state = useSelector((state) => state?.user);
  const { userLoading, userAppErr, userServerErr, profile } = state;

  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    const storedValue = localStorage.getItem("userInfo");
    const parsedValue = storedValue ? JSON.parse(storedValue) : null;
    setUserInfo(parsedValue);
  }, []);

  const balance = useSelector((state) => state?.user?.userAuth?.balance);
  const demoBalance = useSelector(
    (state) => state?.user?.userAuth?.demoBalance
  );

  const userData = useSelector((state) => state?.user?.userAuth);
  const userstate = useSelector((state) => state?.user);
  const { userAuth, userUpdate } = userstate;

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
  const [notification, setNotification] = useState();
  const handleNotification = () => {
    setNotification(!notification);
  };

  const [showMb, setShowMb] = useState(false);

  const handleShowMb = () => {
    setShowMb(!showMb);
  };

  return (
    <div className="cover-whole-top-nav">
      <div className="chart-container">
        <div className="trading-topnav" ref={accountRef}>

          <div className="withdrawal-topnav top-dt">
            <FcAreaChart className="plane" color="#257af0"/>
          </div>
          <div className="withdrawal-topnav top-mb" onClick={handleShowMb}>
            <HiOutlineMenuAlt2 className="plane" color="#257af0"/>
          </div>
          <div className="trading-topnav-wrapper">
            <div className="account-switch" onClick={handleShowAccountSwitch}>
              <div className="live-account">
                <h6>
                  LIVE ACCOUNT
                  <FaAngleDown
                    className={`icon ${showAccountSwitch ? "expanded" : ""}`}
                  />
                </h6>
                <p>
                  {CurrencyFormatter(
                    "USD",
                    profile?.balance ? profile?.balance : "0"
                  )}
                </p>
              </div>
            </div>
            <div className="right-top-nav">
              <div className="account-switch-container">
                <div ref={accountRef}>
                  <div
                    className={`account-swicthbox ${
                      showAccountSwitch ? "open-account-swicthbox" : ""
                    }`}
                  >
                    <div
                      className={`account-switchbox-coat ${
                        showAccountSwitch ? "open-account-switchbox-coat" : ""
                      }`}
                    >
                      <div className="buttons-switch">
                        <Link to="/trading">
                          <div className="switch">
                            <div className="round live">
                              <div className="round-in"></div>
                            </div>
                            <h5>
                              Live account
                              <p>
                                {CurrencyFormatter("USD", profile?.balance)}
                              </p>
                            </h5>
                          </div>
                        </Link>
                        <Link to="/demo">
                          <div className="switch">
                            <div className="round demo"></div>
                            <h5>
                              Demo account
                              <p>
                                {CurrencyFormatter("USD", profile?.demoBalance)}
                              </p>
                            </h5>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="buttons">
                <Link to="/deposit">
                  <button className="deposit">
                    <FaPlus size={14} className="d-plus" />
                    Deposit
                  </button>
                </Link>
                <Link to="/withdrawal">
                  <button className="withdrawal">Withdrawal</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="deposit-topnav top-dt">
            <FcAreaChart className="plane" color="#257af0" />
          </div>
          <div className="deposit-topnav top-mb" onClick={handleShowMb}>
            <HiOutlineMenuAlt3 className="plane" color="#257af0" />
          </div>
        </div>

        <div className={`mb-trading-nav ${showMb ? "visible" : "not-visible"}`}>
          <div className="close-mb" onClick={handleShowMb}><IoCloseOutline size={20}/></div>
          <div className="profile-mb-wrap">
            <Link to="/account">
              <div className="profile-mb">
                <LiaUser color="#fff" size={30}/>
              </div>
            </Link>
            <h4>{userData?.email}</h4>
          </div>

          <div className="mb-menu-links">
            {userData?.isAdmin === true && (
              <Link className="mb-a" to="/admin"><RiAdminLine/>Admin Dashboard</Link>
            )} 
            <Link className="mb-a" to="/deposit"><CiBank/>Deposit</Link>
            <Link className="mb-a" to="/userdeposit"><CiBank/>Deposit history</Link>
            <Link className="mb-a" to="/withdrawal"><RiBankCardLine/>Withdrawal</Link>
            <Link className="mb-a" to="/userwithdrawal"><RiBankCardLine/>Withdrawal history</Link>
            <Link className="mb-a" to="/trades"><HiOutlineChartBarSquare/>Trades</Link>
            <Link className="mb-a" to="/demoTrades"><HiOutlineChartBarSquare/>Demo Trades</Link>
            <a className="mb-a" href="/demoTrades"><PiTelegramLogoLight/>Reach us</a>
          </div>
          <p onClick={handleLogout}><IoExitOutline size={20}/>Logout</p>
        </div>
      </div>
    </div>
  );
};

export default TradingTopNav;
