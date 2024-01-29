import React from 'react'
import { FiMoon } from "react-icons/fi";
import { Spin as Hamburger } from 'hamburger-react'
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
            <div className="menu"><Hamburger size={20}/></div>
        </div>
      </div>
    </div>
  )
}

export default AdminNav