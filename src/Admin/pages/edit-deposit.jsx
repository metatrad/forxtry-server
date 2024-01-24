import React from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/adminSideNav.jsx";
import TopNav from "../components/adminNav";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup"
import { IoIosArrowBack } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { updateDepositAction } from "../../redux/depositSlice.js";
import Disabled from '../../components/disabledbutton'
import { toast } from "react-hot-toast";
import "../adminStyles/single.css";
import { useEffect } from "react";


  //form validation
  const formSchema = Yup.object({
    amount: Yup.number().required("Amount is required"),
    method: Yup.string().required("Amount is required"),
    status: Yup.string(),
  })

const Editdeposit = () => {

  const { filterby } = useParams();
  const depositData = useSelector((state) => state?.deposit?.depositList);
  const depositDisplay = depositData?.docs?.filter((el) => el._id === filterby)[0];
     //dispatch
     const dispatch = useDispatch();
      //formik form
      const formik = useFormik({
        initialValues:{
          amount: depositDisplay?.amount,
          method: depositDisplay?.method,
          status: depositDisplay?.status,
        },
        onSubmit: values =>{
          const data = {
            ...values,
            id: depositDisplay?.id,
          }
          dispatch(updateDepositAction(data))
        },
        validationSchema: formSchema,
      })

      const handleStatusUpdate = () => {
        // Update the formik values for the status field
        formik.setValues({
          ...formik.values,
          status: "approved",
        });
      };

      const deposit = useSelector(state=>state.deposit);
      const {appErr, serverErr, depositUpdated, loading, isDepositUpdated} = deposit
      
      useEffect(() => {
        if (isDepositUpdated) {
          toast('Updated');
        }
      }, [dispatch, isDepositUpdated]); 


  return (
    <div className="single">
      <div className="single-sidebar">
        <Sidebar />
      </div>
      <div className="single-container">
        <TopNav />
        <div className="single-content admin-tables-body">
          <div className="single-top">
            <div className="left">
              <Link to="/admindeposit"><IoIosArrowBack className="icon"/>All deposits</Link>
              <h1>Deposit details</h1>
              <div className="item">
              <div className="admin-users-left">
                <form action="" onSubmit={formik.handleSubmit}>
                  {appErr || serverErr? <div>{appErr}{serverErr}</div>:null}
                  <input type="number" value={formik.values.amount} onChange={formik.handleChange("amount")} onBlur = {formik.handleBlur("amount")}/>
                  <input type="text" value={formik.values.method} onChange={formik.handleChange("method")} onBlur = {formik.handleBlur("method")}/>
                  <div className="status-update"><input type="text" value={formik.values.status} onChange={formik.handleChange("status")} onBlur = {formik.handleBlur("status")}/><button className="status-btn" type="button" onClick={handleStatusUpdate}>Approve</button></div>
 
                  {
                    loading?<Disabled/>: <button className="update-single">Update</button>
                  }
                </form>
                </div>

                <div className="admin-users-right">
                <h6>Deposit screenshot</h6>
                <div className="verification-img-admin">{depositDisplay?.screenshot? <img src={depositDisplay?.screenshot} alt="" />: <h3>No screenshot was uploaded for this deposit</h3>}</div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editdeposit;
