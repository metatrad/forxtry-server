import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup"
import TradingNav from "../components/tradingnav";
import TradingTopNav from "../components/tradingTopNav";
import { MdOutlineClose } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import accountImage from '../images/account-img.png'
import { FaCamera } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import AccountTopNav from "../components/accountTopNav";
import toast from "react-hot-toast";
import Disabledbutton from "../components/disabledbutton";
import { ImFolderUpload } from "react-icons/im";
import { userProfileAction , deleteAccount } from "../redux/userSlice";
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

  const state = useSelector(state => state.user);
  const {userLoading, userAppErr, userServerErr,userAuth, userUpdate } = state

    //navigate
    const navigate = useNavigate();

    //dispatch
    const dispatch = useDispatch();
    const userData = useSelector((state) => state?.user?.userAuth);

  useEffect(()=>{
      dispatch(userProfileAction())
  },[dispatch])

  const states = useSelector(state => state?.user);
  const { profile } = states
    
    //get data from store
    const user = useSelector(state => state?.user);
    //formik form
    const formik = useFormik({
      enableReinitialize: true,
      initialValues:{
        image: userData?.image,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        address: userData?.address,
        dob: userData?.dob,
        phone: userData?.phone,
        email: userData?.email,
        country: userData?.country,
        verification: userData?.verification,
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

//delete account button
const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);

const handleDeleteClick = () => {
  setConfirmationModalVisible(true);
};

const handleConfirmDelete = async () => {
  
  await dispatch(deleteAccount())
  
  setConfirmationModalVisible(false);
};

const handleCancelDelete = () => {
  setConfirmationModalVisible(false);
};



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
          <div className="social-media-account"><h2>Reach out to us on Telegram<a href="https://t.me/+okSu0B6i-2UwYTY0" className="telegram-account"><FaTelegramPlane/></a></h2></div>
          <form action="" className="form-info" onSubmit={formik.handleSubmit}>
          <div className="account-images-cover">
            <div className="account-image">
              <div className="account-img">
                {userData?.image ? <img src={userData?.image}/>: <img src={imagePreview} alt="" />}
                <div className="icon-img"><p><FaCamera/></p><input type="file" accept="image/*"
                onChange={uploadImage}
                onBlur = {formik.handleBlur("image")}/></div>
              </div>

              <div className="account-user-info">
              <h1>Identity info:</h1>
                <h2>{userData?.email}</h2>
                <p>Verification Status: <span className={`status ${profile?.status}`}>{profile?.status}</span></p>
              </div>
            </div>
            <div className="verification-id">
              <h1>Upload your verification ID here: <br /><p>e.g: National ID card, drivers liscence, etc.</p></h1>
              <label htmlFor="verification" className="v-img-label"> <div className="verification-img">{userData?.verification? <img src={userData?.verification}/>: <img src={imageVPreview}/> }</div></label>
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

          <button>{userLoading?<l-spiral size="35" speed="0.9" color="white"></l-spiral>:"Save"}</button>

            </div>

          </form>
          <button onClick={handleDeleteClick} className="delete-account">
            <MdOutlineClose />
            Delete Account
          </button>

                
      {confirmationModalVisible && (
        <div className="confirm-delete-account">
          <p>Are you sure you want to delete your account?</p>
          <div className="buttons-confirm">
          <button className="yes-delete" onClick={handleConfirmDelete}>Yes</button>
          <button className="no-delete" onClick={handleCancelDelete}>No</button>
          </div>
        </div>
      )}

        </div>
      </div>
    </div>
  );
};

export default Account;
