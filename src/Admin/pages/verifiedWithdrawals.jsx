import React from 'react'
import Sidebar from '../components/adminSideNav.jsx'
import TopNav from '../components/adminNav'
import ApprovedWithdrawal from '../components/approvedWithdrawal'
import '../adminStyles/withdrawal.css'


const AdmindVwithdrawal = () => {
  return (
    <div className='admin-withdrawal'>
        <div className="side-bar">
            <Sidebar/>
        </div>
        <div className="admin-withdrawal-page">
            <TopNav/>
            <div className="admin-withdrawal-body admin-tables-body">
              <ApprovedWithdrawal/>
            </div>
        </div>
    </div>
  )
}

export default AdmindVwithdrawal
