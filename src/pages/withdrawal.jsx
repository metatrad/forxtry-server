import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import TradingNav from "../components/tradingnav";
import TradingTopNav from "../components/tradingTopNav";
import DepositFooter from "../components/depositFooter";
import { IoChevronUpOutline } from "react-icons/io5";
import { IoAlertOutline } from "react-icons/io5";
import { useFormik } from "formik";
import { withdrawalAction } from "../redux/withdrawalSlice"; 
import { withdrawalOtpAction } from "../redux/withdrawalSlice"; 
import * as Yup from "yup";
import { spiral } from "ldrs";
import { CgMoveRight } from "react-icons/cg";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { userProfileAction } from "../redux/userSlice";
import AccountTopNav from "../components/accountTopNav";
import { toast } from "react-hot-toast";
import currencyFormatter from "../utilities/currencyFormatter";
import { IoClose } from "react-icons/io5";
import { IoCheckmark } from "react-icons/io5";
import "../styles/withdrawal.css";

//form validation
const formotpSchema = Yup.object({
  email: Yup.string(),
});
const formSchema = Yup.object({
  amount: Yup.number().required("Amount is required"),
  account: Yup.string().required("This field is required"),
  number: Yup.string().required("This field is required"),
  name: Yup.string().required("This field is required"),
  otp: Yup.string().required("This field is required"),
  status: Yup.string(),
});

const Withdrawal = () => {

  const stateUser = useSelector(state => state?.user);
  const {userLoading, userAppErr, userServerErr,userAuth, userUpdate } = stateUser

  //get deposit methods
  const { filterby } = useParams();
  const methodData = useSelector((state) => state.method.methodList);
  const methodDisplay = methodData.filter((el) => el._id === filterby)[0];

  const loginData = JSON.parse(localStorage.getItem('userInfo'))

  //dispatch
  const dispatch = useDispatch();

  //formik form
  const formikotp = useFormik({
    initialValues: {
      email: loginData?.email,
    },
    onSubmit: async (values) => {
      setShowCode(true)
      dispatch(withdrawalOtpAction(values))
    },
    validationSchema: formotpSchema,
  });

  const formik = useFormik({
    initialValues: {
      amount: 0,
      number: "",
      account: "",
      name: "",
      otp: "",
    },
    onSubmit: async (values, { resetForm, setStatus }) => {
      dispatch(withdrawalAction(values))
      resetForm({values: ''})
    },
    validationSchema: formSchema,
  });

useEffect(()=>{
    dispatch(userProfileAction())
},[dispatch])

const states = useSelector(state => state?.user);
const { profile } = states
//get deposit created from store
const state = useSelector((state) => state?.withdrawal);
const { appErr, loading, serverErr, isWithdrawalCreated,withdrawalOtpSent } = state;


  //redirect
  useEffect(() => {
    if (withdrawalOtpSent) {
      toast("Otp sent");
    }
  }, [ dispatch, withdrawalOtpSent ]);

  useEffect(() => {
    if (isWithdrawalCreated) {
      toast.success("Withdrawal placed");
    }
  }, [ dispatch, isWithdrawalCreated ]);

  const userBalance = useSelector((state) => state.deposit);

  const userData = useSelector((state) => state.user);

  //show otp
  const[showCode, setShowCode] = useState(false)
  const handleshowCode =()=>{
    setShowCode(!showCode)
  }


  return (
    <div className="trade-withdrawal">

      <div className="top-nav">
        <TradingTopNav />
      </div>
      <div className="withdrawal-wrapper">
        <div className="withdrawal-sidenav">
          <TradingNav />
        </div>
        <div className="withdrawal-body-container">
       <div className="withdrawal-container">
          <AccountTopNav />
          <div className="withdrawal-body">
            <div className="withdrawal-body-left">

            <form className="email-withdraw-form" onSubmit={formikotp.handleSubmit}>
              <label htmlFor="email">Email</label>
                 <input
                   type="email"
                   name="email"
                   id="email"
                   placeholder="Email"
                   value={formikotp.values.email}
                   onChange={formikotp.handleChange("email")}
                   onBlur = {formikotp.handleBlur("email")}
                 />
                 <div className="show-error">
                   {formikotp.touched.email && formikotp.errors.email}
                 </div>
            </form>
          
              <h1>Account:</h1>
              <div className="withdrawal-balance">
                <div>
                  <p>In the account:</p>
                  <h4>{currencyFormatter("USD", userAuth?.balance)}</h4>
                </div>
                <div className="no-border"> 
                  <p>Available for withdrawal:</p>
                  <h4>{currencyFormatter("USD", userAuth?.balance)}</h4>
                </div>
              </div>
              
            </div>
            {
          profile?.status === "Pending" || profile?.status === "Unverified"? <div className="withdrawal-verified">! You need to be verified to make a withdrawal. <br /> Please go to the account section and verify your account.</div> :
            <div className="withdrawal-body-right">
              <h1>Withdrawal:</h1>
              <div className="withdrawal-amount">
                {serverErr || appErr ? (
                  <div className="show-error-top">
                    {appErr}
                  </div>
                ) : null}
                <form action="" onSubmit={formik.handleSubmit}>
                  <label htmlFor="amount">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    placeholder="$"
                    vvalue={formik.values.amount}
                    onChange={formik.handleChange("amount")}
                    onBlur={formik.handleBlur("amount")}
                  />
                  <div className="show-error">
                    {formik.touched.amount && formik.errors.amount}
                  </div>

                  <h1>Withdraw to:</h1>
                  <label htmlFor="number">Number/address</label>
                  <input
                    type="text"
                    name="number"
                    id="amount"
                    placeholder="Number"
                    value={formik.values.number}
                    onChange={formik.handleChange("number")}
                    onBlur={formik.handleBlur("number")}
                  />
                  <div className="show-error">
                    {formik.touched.number && formik.errors.number}
                  </div>

                  <label htmlFor="account">Account/currency</label>
                  <input
                    type="text"
                    name="account"
                    id="account"
                    placeholder="Account"
                    value={formik.values.account}
                    onChange={formik.handleChange("account")}
                    onBlur={formik.handleBlur("account")}
                  />
                  <div className="show-error">
                    {formik.touched.account && formik.errors.account}
                  </div>

                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange("name")}
                    onBlur={formik.handleBlur("name")}
                  />
                  <div className="show-error">
                    {formik.touched.name && formik.errors.name}
                  </div>

                  {
                    showCode &&
                    <div className="withdrawal-otp-box">
                      <p>Please enter the PIN-code we've just sent to your email</p>

                      <label htmlFor="otpWithdraw">Code
                      <input type="text" id="otpWithdraw" name="otpWithdraw"
                      placeholder="Enter 6 digit code..."                    
                      value={formik.values.otp}
                      onChange={formik.handleChange("otp")}
                      onBlur={formik.handleBlur("otp")}
                    />
                    <div className="show-error">
                      {formik.touched.otp && formik.errors.otp}
                    </div>
  
                      </label>
                    </div>
                  }

                  {profile?.withdrawalCode==="yes" && showCode===false?
                    <button onClick={formikotp.handleSubmit} className="submit-main" type="button">
                      {
                        loading? <l-spiral size="35" speed="0.9" color="white"></l-spiral>: <span>Get otp
                        <CgMoveRight className="withdraw-icon" /></span> 
                      }
                    </button>:
                    <button className="submit-main" type="submit">
                      {
                        loading? <l-spiral size="35" speed="0.9" color="white"></l-spiral>: <span>Withdraw
                        <IoChevronUpOutline className="withdraw-icon" /></span> 
                      }
                    </button>
                  }

                </form>

                <div className="warning">
                  <IoAlertOutline className="alert-icon" />
                  Withdrawals are processed in three business days.
                  <br />
                  <br />
                  Please fill in the required fields
                </div>
              </div>
            </div>
             }
          </div>
          <div className="withdrawal-footer">
            <DepositFooter />
          </div>
        </div>
        </div>
 
      </div>
    </div>
  );
};

export default Withdrawal;
