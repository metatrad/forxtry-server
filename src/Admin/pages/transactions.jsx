import React from "react";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup"
import Table from "../components/table";
import Sidebar from '../components/adminSideNav.jsx'
import toast from "react-hot-toast";
import TopNav from '../components/adminNav'
import Disabledbutton from "../../components/disabledbutton";
import { updatePercAction } from "../../redux/percSlice";
import '../adminStyles/transaction.css'

//form validation
const formSchema = Yup.object({
  perc: Yup.number(),
})

const Transactions = () => {

  const dispatch = useDispatch();

  const state = useSelector(state => state?.perc);
  console.log(state)
  const {loading, appErr, serverErr, percCreated, percUpdated } = state


  //formik form
  const formik = useFormik({
    enableReinitialize: true,
    initialValues:{
      perc: percCreated?.perc,
    },
    onSubmit: async (values) =>{
      dispatch(updatePercAction(values))
    },
    validationSchema: formSchema,
  })

   useEffect(()=>{
    if(percUpdated){
      toast("Updated")
    }
  },[dispatch, percUpdated]);

  return (
    <div className="list-container">
      <div className="side-bar">
        <Sidebar />
      </div>
      <div className="list">
      <TopNav/>
      <div className="padding">
      <div className="list-wrapper">
      <div className="list-title">Latest Transactions</div>
            <form action="" onSubmit={formik.handleSubmit}>
                 <label htmlFor="perc">Email</label>
                 <input type="number" name="number" id="number" value={formik.values.perc}
                 onChange={formik.handleChange("perc")}
                 onBlur = {formik.handleBlur("perc")}/>

            {loading? <Disabledbutton/>:<button>Save</button>}
            </form>
      </div>
      </div>
      </div>
    </div>
  );
};

export default Transactions;
