import React, { useEffect }  from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { loginWithOTP } from "../redux/userSlice";
import * as Yup from "yup"
import Disabledbutton from "../components/disabledbutton";
import "../styles/login.css";
import { Link } from "react-router-dom";
import { BiLogoFacebook } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { BsArrowRightShort } from "react-icons/bs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";


//form validation
const formSchema = Yup.object({
  email: Yup.string(),
  otp: Yup.string(),
})


const Otp = () => {
  //navigate
  const navigate = useNavigate();
  
  //dispatch
  const dispatch = useDispatch();
  
  //get data from store
  const user = useSelector(state => state?.user);
  const { userAppErr, userServerErr, userLoading, userAuth } = user;

  //formik form
  const formik = useFormik({
    initialValues:{
      email: "",
      otp: "",
    },
    onSubmit: values =>{
      dispatch(loginWithOTP(values))
    },
    validationSchema: formSchema,
  });

  //redirect
  useEffect(()=>{
    if(userAuth){
      navigate('/trading')
      toast("Logged in", {
        className: "toast-message-login",
      });
    }
  },[userAuth])

  return (
    <div>
      <Navbar />
      <div className="login">
        <h1>Enter the OTP sent to your email</h1>
        <div className="login-box">
        <div className="account-buttons">
            <Link to="/login">
              <button className="login">Login</button>
            </Link>
            <Link to="/signup">
              <button className="registration">Registration</button>
            </Link>
          </div>
          {userAppErr || userServerErr ? <div className="show-error-top">{userServerErr}{userAppErr}</div> : null}
          <form className="login-form" action="" onSubmit={formik.handleSubmit}>

            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange("email")}
              onBlur = {formik.handleBlur("email")}
            />
            <div className="show-error">
              {formik.touched.email && formik.errors.email}
            </div>
            
            <label htmlFor="otp">OTP</label>
            <input
              type="text"
              name="otp"
              id="otp"
              placeholder="OTP"
              value={formik.values.otp}
              onChange={formik.handleChange("otp")}
              onBlur = {formik.handleBlur("otp")}
            />
            <div className="show-error">
              {formik.touched.otp && formik.errors.otp}
            </div>

            {
              userLoading? (<Disabledbutton/>):<button type="submit" className="signin-btn">Sign in<p><BsArrowRightShort size={23} /></p></button>
            }

          </form>

          <div className="login-bottom">
            <h4>Sign in via</h4>

            <div className="login-media">
              <h2 className="login-fb">
                {" "}
                <BiLogoFacebook />
              </h2>
              <h2 className="login-gg">
                <FcGoogle />
              </h2>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Otp;
