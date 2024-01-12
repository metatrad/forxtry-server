import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import '../styles/account.css'

const AccountTopNav = () => {

    const userData = useSelector((state) => state?.user?.userAuth);

  return (
    <div className="account-options-cover">
      <div className="account-options">
        {userData?.email === process.env.REACT_APP_ADMIN_EMAIL && (
          <NavLink to="/admin">
            <div>Admin Dashboard</div>
          </NavLink>
        )}
        <NavLink to="/deposit">
          <div>Deposit</div>
        </NavLink>
        <NavLink to="/withdrawal">
          <div>Withdrawal</div>
        </NavLink>
        <NavLink to="/userdeposit">
          <div>Deposit history</div>
        </NavLink>
        <NavLink to="/userwithdrawal">
          <div>Withdrawal history</div>
        </NavLink>
        <NavLink to="/trades">
          <div>Trade history</div>
        </NavLink>
        <NavLink to="/account">
          <div>Account</div>
        </NavLink>
      </div>
    </div>
  );
};

export default AccountTopNav;
