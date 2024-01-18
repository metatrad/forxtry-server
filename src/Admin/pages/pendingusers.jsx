import React from 'react'
import Sidebar from '../components/adminSideNav.jsx'
import TopNav from '../components/adminNav'
import PendingDataTable from '../components/pendingTable'
import '../adminStyles/users.css'

const PendingUsers = () => {
  return (
    <div className='admin-users'>
        <div className="side-bar">
            <Sidebar/>
        </div>
        <div className="admin-list">
            <TopNav/>
            <div className='users-table'>
            <PendingDataTable/>
            </div> 
        </div>
    </div>
  )
}

export default PendingUsers;
