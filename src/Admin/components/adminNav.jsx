import React from 'react'
import { FiMoon } from "react-icons/fi";
import { LightModeContext } from '../../context/lightModeContext';
import { useContext } from 'react';
import '../adminStyles/adminNav.css'

const AdminNav = () => {

  const {dispatch} = useContext(LightModeContext)

  return (
    <div className='adminNav'>
      <div className="wrapper">
        <div className="right-items">
            <div className="themes" onClick={()=> dispatch({type:"TOGGLE"}) }><FiMoon/></div>
        </div>
      </div>
    </div>
  )
}

export default AdminNav
