import React, {useState} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup"
import TradingNav from "../components/tradingnav";
import TradingTopNav from "../components/tradingTopNav";
import { MdOutlineClose } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import accountImage from '../images/account-img.png'
import { FaCamera } from "react-icons/fa";
import AccountTopNav from "../components/accountTopNav";
import toast from "react-hot-toast";
import Disabledbutton from "../components/disabledbutton";
import { ImFolderUpload } from "react-icons/im";
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import "../styles/account.css";
import { ImagetoBase64 } from "../Admin/utility/ImagetoBase64";
import { updateProfileAction } from "../redux/userSlice";

//form validation
const formSchema = Yup.object({
  image: Yup.mixed(),
  firstName: Yup.string(),
  lastName: Yup.string(),
  address: Yup.string(),
  dob: Yup.string(),
  phone: Yup.number(),
  email: Yup.string(),
  country: Yup.string(),
  verification: Yup.mixed(),
})

const Account = () => {

  const state = useSelector(state => state?.user);
  const {userLoading, userAppErr, userServerErr,userAuth, profile, userUpdate } = state

    //navigate
    const navigate = useNavigate();

    //dispatch
    const dispatch = useDispatch();
    
    //get data from store
    const user = useSelector(state => state?.user);  
    //formik form
    const formik = useFormik({
      enableReinitialize: true,
      initialValues:{
        image: userAuth?.image,
        firstName: userAuth?.firstName,
        lastName: userAuth?.lastName,
        address: userAuth?.address,
        dob: userAuth?.dob,
        phone: userAuth?.phone,
        email: userAuth?.email,
        country: userAuth?.country,
        verification: userAuth?.verification,
      },
      onSubmit: async (values) =>{
        dispatch(updateProfileAction(values))
      },
      validationSchema: formSchema,
    })
    useEffect(() => {
      if (userUpdate) {
        toast('Profile updated');
      }
    }, [dispatch, userUpdate]); 
    const [imagePreview, setImagePreview] = useState(userAuth?.image || accountImage)
    const [imageVPreview, setImageVPreview] = useState(userAuth?.verification || <span><ImFolderUpload/></span>)

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

const uploadVImage = async (e) => {
  const file = e.target.files[0];

  if (file) {
    const data = await ImagetoBase64(file);
    formik.setFieldValue('verification', data);

    // Set image preview for immediate display
    const reader = new FileReader();
    reader.onload = () => {
      setImageVPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }
};


  const userData = useSelector((state) => state?.user?.userAuth);

  return (
    <div>
      <div className="check">
        <div className="tradingNav">
          <TradingTopNav />
        </div>
      </div>

      <div className="trading-section">
        <div className="tradingnav">
          <TradingNav />
        </div>

        <div className="account-settings">

          <div><AccountTopNav/></div>
          <form action="" className="form-info" onSubmit={formik.handleSubmit}>
          <div className="account-images-cover">
            <div className="account-image">
              <div className="account-img">
                {userAuth?.image ? <img src={userAuth?.image}/>: <img src={imagePreview} alt="" />}
                <div className="icon-img"><p><FaCamera/></p><input type="file" accept="image/*"
                onChange={uploadImage}
                onBlur = {formik.handleBlur("image")}/></div>
              </div>

              <div className="account-user-info">
              <h1>Identity info:</h1>
                <h2>{userData?.email}</h2>
                <p>Verification Status: <span className={`status ${userAuth?.status}`}>{userAuth?.status}</span></p>
              </div>
            </div>
            <div className="verification-id">
              <h1>Upload your verification ID here: <br /><p>e.g: National ID card, drivers liscence, etc.</p></h1>
              <label htmlFor="verification" className="v-img-label"> <div className="verification-img">{userAuth?.verification? <img src={userAuth?.verification}/>: <img src={imageVPreview}/> }</div></label>
              <input type="file" className="v-img-input" id="verification" accept="image/*"
              onChange={uploadVImage}
              onBlur = {formik.handleBlur("verification")}/>
            </div>
            </div>

            <div className="inputs-cover">

            <div className="inputs"> 
            <label htmlFor="email">Email</label>
            <input type="text" name="email" id="email" value={formik.values.email}
            onChange={formik.handleChange("email")}
            onBlur = {formik.handleBlur("email")}/>
            </div>

            <div className="inputs">
            <label htmlFor="firstName">First Name</label>
            <input type="text" name="firstName" id="firstName" value={formik.values.firstName}
            onChange={formik.handleChange("firstName")}
            onBlur = {formik.handleBlur("firstName")}/>
            </div>

            <div className="inputs">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" name="lastName" id="lastName" value={formik.values.lastName}
              onChange={formik.handleChange("lastName")}
              onBlur = {formik.handleBlur("lastName")}/>
            </div>

            <div className="inputs">
            <label htmlFor="country">Country</label>
            <input type="text" name="country" id="country" value={formik.values.country}
              onChange={formik.handleChange("country")}
              onBlur = {formik.handleBlur("country")}/>
            </div>

            <div className="inputs">
            <label htmlFor="address">Address</label>
            <input type="text" name="address" id="address" value={formik.values.address}
              onChange={formik.handleChange("address")}
              onBlur = {formik.handleBlur("address")}/>
            </div>

            <div className="inputs">
            <label htmlFor="dob">Date Of Birth</label>
            <input type="date" name="dob" id="dob" value={formik.values.dob}
              onChange={formik.handleChange("dob")}
              onBlur = {formik.handleBlur("dob")}/>
            </div>

            {
              userLoading? <Disabledbutton/>:<button>Save</button>
            }

            </div>

          </form>
          <h6>
            <MdOutlineClose />
            Delete Account
          </h6>
        </div>
      </div>
     <TawkMessengerReact propertyId="6596407f0ff6374032bbfebd" widgetId="1hj9ensqv"/>
    </div>
  );
};

export default Account;
