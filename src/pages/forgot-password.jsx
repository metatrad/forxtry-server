import React, { useEffect }  from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { forgotPAction } from "../redux/userSlice";
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup"
import Disabledbutton from "../components/disabledbutton";
import "../styles/login.css";
import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";


//form validation
const formSchema = Yup.object({
  email: Yup.string().required("Email is required"),
})


const ForgotP = () => {
  //navigate
  const navigate = useNavigate();
  
  //dispatch
  const dispatch = useDispatch();
  
  //get data from store
  const user = useSelector(state => state?.user);
  const { userAppErr, userServerErr, userLoading, linkSent } = user;

  //formik form
  const formik = useFormik({
    initialValues:{
      email: "",
    },
    onSubmit: values =>{
      dispatch(forgotPAction(values))
    },
    validationSchema: formSchema,
  });

  //redirect
  useEffect(()=>{
    if(linkSent){
      toast("A link has been sent to your email to reset your password.");
    }
  },[dispatch, linkSent])

  return (
    <div>
      <Navbar />
      <div className="login">
        <h1>Enter mail to reset your password.</h1>
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

            {
              userLoading? (<Disabledbutton/>):<button className="signin-btn">Send<p><BsArrowRightShort size={23} /></p></button>
            }

          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotP;
