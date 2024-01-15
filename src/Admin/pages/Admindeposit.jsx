import React from "react";
import Sidebar from "../components/adminSideNav.jsx";
import TopNav from "../components/adminNav";
import AdminDepositTable from "../components/depositTable.jsx";
import "../adminStyles/deposit.css";

const Admindeposit = () => {

  return (
    <div className="admin-deposit">
      <div className="side-bar">
        <Sidebar />
      </div>
      <div className="admin-deposit-page">
        <TopNav />        
        <div className="admin-deposit-body">
        <div className="deposit-list">
        <AdminDepositTable/>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Admindeposit;
