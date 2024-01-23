import React from 'react'
import Sidebar from '../components/adminSideNav.jsx'
import VerifiedDataTable from '../components/verifiedTable'
import TopNav from '../components/adminNav'
import '../adminStyles/users.css'

const VerifiedUsers = () => {
  return (
    <div className='admin-users'>
        <div className="side-bar">
            <Sidebar/>
        </div>
        <div className="admin-list">
            <TopNav/>
            <div className='users-table admin-tables-body'>
            <VerifiedDataTable/>
            </div> 
        </div>
    </div>
  )
}

export default VerifiedUsers;
