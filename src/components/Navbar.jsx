import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from "react";
import '../styles/Navbar.css'
import '../App.css'
import { FiGlobe } from 'react-icons/fi';
import { FiMoon } from "react-icons/fi";
import { useContext } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { FiChevronUp } from 'react-icons/fi';
import { FiChevronRight } from 'react-icons/fi';
import { Cross as Hamburger } from 'hamburger-react'
import EngImage from '../images/eng.png'
import { LightModeContext } from '../context/lightModeContext';


const Navbar = () => {

  const {dispatch} = useContext(LightModeContext)

  //show language opions
  const [showLanguage,setShowLanguage] = useState(false);
  const handleShowLanguage = () => {
        setShowLanguage( prev => !prev )
  }
  let languageRef = useRef();
  useEffect(() => {
      let handler = (e)=> {
          if(!languageRef.current.contains(e.target)){
              setShowLanguage(false);
          }
      }
      document.addEventListener("mousedown", handler);

      return()=>{
          document.removeEventListener("mousedown", handler);
      }
  },[]);

  //responsivepart
  const [showNavLanguage,setShowNavLanguage] = useState(false);
  const handleShowNavLanguage = () => {
        setShowNavLanguage( prev => !prev )
  }
  let languageNavRef = useRef();
  useEffect(() => {
    if (languageNavRef.current) {
        let handler = (e) => {
            if (!languageNavRef.current.contains(e.target)) {
                setShowNavLanguage(false);
            }
        }
        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }
    }
}, []);

  //display responsve nav

  const [showNav,setShowNav] = useState(false);
  const handleShowNav = () => {
          setShowNav( prev => !prev )
  }


  showNav?document.body.style.overflow = "hidden" : document.body.style.overflow = "auto"

  
  return (
    <div className="nav-container">
      <div className='navbar'>
      <div className="nav-left">
        <div className="navlinks">
        <NavLink to="/faq">FAQ</NavLink>
        <NavLink to="/about">About us</NavLink>
        </div>
      {/* responsive */}
      <p className="menu" onClick={handleShowNav}> <Hamburger distance="lg" rounded size={18}/></p>
      </div>

      <div className="nav-middle">
      <Link to="/"><div className="logo top-nav-logo"></div></Link>
      </div>

      <div className="nav-right">
        
      {/* <div className="themes" onClick={()=> dispatch({type:"TOGGLE"}) }><FiMoon/></div> */}
      <Link to="/login"><button className='login-btn'>Log in</button></Link>
      <Link to="/signup"><button className='signup-btn'>Sign up</button></Link>
  
      </div>

    </div>

      <div className={showNav? "responsive-menu": 'responsive-menu-hide'}>
      <div className='res-links'>
      <Link to="/faq" onClick={handleShowNav}>FAQ <FiChevronRight size={25} color="#5c5e68"/></Link>
      <Link to="/about" onClick={handleShowNav}>About us <FiChevronRight size={25} color="#5c5e68"/></Link>
      <Link to="/login" onClick={handleShowNav}>Sign up<FiChevronRight size={25} color="#5c5e68"/></Link>
      <Link to="/signup" onClick={handleShowNav}>Login<FiChevronRight size={25} color="#5c5e68"/></Link>
      </div>
    </div>
    
    </div>

    
  )
}

export default Navbar;
