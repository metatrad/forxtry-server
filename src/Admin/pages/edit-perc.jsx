import React from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/adminSideNav.jsx";
import TopNav from "../components/adminNav";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup"
import { IoIosArrowBack } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { updatePercAction } from "../../redux/percSlice";
import Disabled from '../../components/disabledbutton'
import { toast } from "react-hot-toast";
import "../adminStyles/single.css";
import { useEffect } from "react";


  //form validation
  const formSchema = Yup.object({
    perc: Yup.number(),
    demoperc: Yup.number(),
  })

const Editperc = () => {

  const { filterby } = useParams();
  const percData = useSelector(state => state?.perc?.percList)
  const percDisplay = percData?.filter((el) => el._id === filterby)[0];

     //dispatch
     const dispatch = useDispatch();
      //formik form
      const formik = useFormik({
        initialValues:{
          perc: percDisplay?.perc,
          demoperc: percDisplay?.demoperc,
        },
        onSubmit: values =>{
          const data = {
            ...values,
            id: percDisplay?._id,
          }
          dispatch(updatePercAction(data))
        },
        validationSchema: formSchema,
      })

      const perc = useSelector(state=>state.perc);
      const {appErr, serverErr, percUpdated, loading, isPercUpdated } = perc
      
      useEffect(() => {
        if (isPercUpdated) {
          toast('Updated');
        }
      }, [dispatch, isPercUpdated]); 




  return (
    <div className="single">
      <div className="single-sidebar">
        <Sidebar />
      </div>
      <div className="single-container">
        <TopNav />
        <div className="single-content">
          <div className="single-top">
            <div className="left">
              <Link to="/admintransactions"><IoIosArrowBack className="icon"/>Back</Link>
              <h1>Enter winning rate percentage</h1>
              <div className="item">
                <form action="" onSubmit={formik.handleSubmit}>
                  {appErr || serverErr? <div>{appErr}{serverErr}</div>:null}
                  <input type="number" placeholder="%" value={formik.values.perc} onChange={formik.handleChange("perc")} onBlur = {formik.handleBlur("perc")}/>
                  <input type="number" placeholder="%" value={formik.values.demoperc} onChange={formik.handleChange("demoperc")} onBlur = {formik.handleBlur("demoperc")}/>
                  {
                    loading?<Disabled/>: <button>Update</button>
                  }
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editperc;
