import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/adminSideNav.jsx";
import TopNav from "../components/adminNav";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup"
import { IoIosArrowBack } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { updateMethodAction } from "../../redux/methodSlice.js";
import Disabled from '../../components/disabledbutton'
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { ImFolderUpload } from "react-icons/im";
import { ImagetoBase64 } from "../utility/ImagetoBase64";
import "../adminStyles/single.css";


  //form validation
  const formSchema = Yup.object({
    image: Yup.string(),
    qrcode: Yup.string(),
    name: Yup.string(),
    description: Yup.string(),
    user: Yup.string(),
    number: Yup.string(),
    calc: Yup.number(),
  })

const Editmethod = () => {

  const { filterby } = useParams();
  const methodData = useSelector((state) => state?.method?.methodList);
  const methodDisplay = methodData?.filter((el) => el.id === filterby)[0];

  const method = useSelector(state=>state?.method);
  const { appErr, serverErr, methodUpdated, loading, methodallList,ismethodUpdated } = method

     //dispatch
     const dispatch = useDispatch();
      //formik form
      const formik = useFormik({
        initialValues:{
          image: methodDisplay?.image,
          name: methodDisplay?.name,
          calc: methodDisplay?.calc,
          qrcode: methodDisplay?.qrcode,
          description: methodDisplay?.description,
          user: methodDisplay?.user,
          number: methodDisplay?.number,
        },
        onSubmit: values =>{
          const data = {
            ...values,
            id: methodDisplay?.id,
          }
          dispatch(updateMethodAction(data))
          if (ismethodUpdated) {
            toast.success("Updated");
          }
        },
        validationSchema: formSchema,
      })

      const [imagePreview, setImagePreview] = useState(methodDisplay?.image || <span><ImFolderUpload/></span>)
      const [imageVPreview, setImageVPreview] = useState(methodDisplay?.qrcode || <span><ImFolderUpload/></span>)

      useEffect(() => {
        if (ismethodUpdated) {
          toast('Updated');
        }
      }, [dispatch, ismethodUpdated]); 


      const uploadImage = async (e) => {
        const file = e.target.files[0];
      
        if (file) {
          const data = await ImagetoBase64(file);
          formik.setFieldValue('image', data);
      
          // Set image preview for immediate display
          const reader = new FileReader();
          reader.onload = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
      };
      
      const uploadQRImage = async (e) => {
        const file = e.target.files[0];
      
        if (file) {
          const data = await ImagetoBase64(file);
          formik.setFieldValue('qrcode', data);
      
          // Set image preview for immediate display
          const reader = new FileReader();
          reader.onload = () => {
            setImageVPreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
      };




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
              <Link to="/admindepositmethod"><IoIosArrowBack className="icon"/>All wthdrawals</Link>
              <h1>Detail</h1>
              <div className="item">
                <form action="" onSubmit={formik.handleSubmit}>

            <div className="account-images-cover-admin">
            <div>
            <p>Logo image</p>
            <label htmlFor="image">
            <div className="image-method-update">
                <img src={imagePreview} alt="" />
                <div><input type="file" name="image" id="image" accept="image/*"
                onChange={uploadImage}
                onBlur = {formik.handleBlur("image")}/></div>
            </div>
            </label>
            </div>

            <div>
                <p>Qr code image</p>
            <label htmlFor="qrcode">
            <div className="qr-code-update">
              <label htmlFor="qrcode"> <div><img src={imageVPreview}/></div></label>
              <input type="file" id="qrcode" accept="image/*"
              onChange={uploadQRImage}
              onBlur = {formik.handleBlur("qrcode")}/>
            </div>
            </label>
            </div>
            </div>

                  {appErr || serverErr? <div>{appErr}{serverErr}</div>:null}
                  <input type="text" value={formik.values.name} onChange={formik.handleChange("name")} onBlur = {formik.handleBlur("name")}/>
                  <input type="text" value={formik.values.number} onChange={formik.handleChange("number")} onBlur = {formik.handleBlur("number")}/>
                  <input type="calc" value={formik.values.calc} onChange={formik.handleChange("calc")} onBlur = {formik.handleBlur("calc")}/>
                  <input type="text" value={formik.values.description} onChange={formik.handleChange("description")} onBlur = {formik.handleBlur("description")}/>
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

export default Editmethod;
