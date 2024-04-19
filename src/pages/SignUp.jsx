import React, { useEffect } from "react";
import "../styles/signup.css";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup"
import { useNavigate } from 'react-router-dom';
import { signupAction } from "../redux/userSlice";
import { Link } from "react-router-dom";
import { BiLogoFacebook } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { BsArrowRightShort } from "react-icons/bs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Disabledbutton from "../components/disabledbutton";
import toast from "react-hot-toast";


//form validation
const formSchema = Yup.object({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
})

const SignUp = () => {
  //navigate
  const navigate = useNavigate();

  //dispatch
  const dispatch = useDispatch();
  
  //get data from store
  const user = useSelector(state => state?.user);
  const { userAppErr, userServerErr, userLoading, isRegistered } = user;

  //formik form
  const formik = useFormik({
    initialValues:{
      email: "",
      password: "",
    },
    onSubmit: values =>{
      dispatch(signupAction(values))
    },
    validationSchema: formSchema,
  })

  //redirect
  useEffect(()=>{
    if(isRegistered){
      navigate('/login')
      toast("Signed up successfully", {
        className: "toast-message-signup",
      });
    }
  },[isRegistered])


  return (
    <div>
      <Navbar />
      <div className="signup">
        <h1>Create an account to start trading</h1>
        <div className="signup-box">
          <div className="account-buttons">
            <Link to="/login">
              <button className="login">Login</button>
            </Link>
            <Link to="/signup">
              <button className="registration">Registration</button>
            </Link>
          </div>

          {userAppErr || userServerErr ? <div className="show-error-top">{userServerErr}{userAppErr}</div> : null}
          <form className="signup-form" action="" onSubmit={formik.handleSubmit}>
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

            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={formik.values.passowrd}
              onChange={formik.handleChange("password")}
              onBlur = {formik.handleBlur("password")}
            />
            <div className="show-error">
              {formik.touched.password && formik.errors.password}
            </div>

            <div className="check">
              <input
                type="checkbox"
                id="checkbox"
                className="checkbox"
                required
              />
              <label htmlFor="checkbox">
                I confirm that I am 18 years old and accept
                <br /> <Link to="/agreement">Service Agreement</Link>
              </label>
            </div>

            {
              userLoading?  (<Disabledbutton/>):<button className="registration-btn">Registration<p><BsArrowRightShort size={23} /></p></button>
            }

          </form>

          {/* <div className="signin-bottom">
            <h4>Sign in via</h4>

            <div className="signin-media">
              <h2 className="signup-fb">
                {" "}
                <BiLogoFacebook />
              </h2>
              <h2 className="signup-gg">
                <FcGoogle />
              </h2>
            </div>
          </div> */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
