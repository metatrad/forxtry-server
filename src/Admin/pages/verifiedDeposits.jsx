import React from "react";
import Sidebar from "../components/adminSideNav.jsx";
import TopNav from "../components/adminNav";
import ApprovedDeposit from '../components/approvedDeposit'
import "../adminStyles/deposit.css";

const AdminVdeposit = () => {

  return (
    <div className="admin-deposit">
      <div className="side-bar">
        <Sidebar />
      </div>
      <div className="admin-deposit-page">
        <TopNav />        
        <div className="admin-deposit-body admin-tables-body">
        <div className="deposit-list">
        <ApprovedDeposit/>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVdeposit;