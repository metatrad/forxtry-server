import React from "react";
import { useState } from "react";
import Sidebar from "../components/adminSideNav.jsx";
import TopNav from "../components/adminNav";
import { IoMdClose } from "react-icons/io";
import { IoMdCloudUpload } from "react-icons/io";
import { ImagetoBase64 } from "../utility/ImagetoBase64.js";
import { toast } from "react-hot-toast"
import AdminMethodTable from "../components/methodTable.jsx";
import "../adminStyles/deposit.css";

const AdmindepositMethod = () => {

  //showAdddeposit menu method
  const [showAddmethod, setShowAddmethod] = useState();
  const handleShowAddmethod = () => {
    setShowAddmethod((preve) => !preve);
  };

  //upload deposit methods
  const [data,setData] = useState({
    image: "",
    name: "",
    number: "",
    user: "",
    description: "",
    qrcode: "",
    calc: "",
  })

  const handleOnchange = (e) =>{
    const {name,value} = e.target

    setData((preve)=>{
      return{
        ...preve,
        [name] : value
      }
    })

  }
  const handleSubmit = async(e) =>{
    e.preventDefault()

    const { image,name,number,user,description,qrcode, calc} = data

    if (image && name && number && user ){
      const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN }/admindeposit`,{
        method : "POST",
        headers : {
          "content-type" : "application/json"
        },
        body : JSON.stringify(data)
      })
  
      const fetchRes = await fetchData.json()
      toast(fetchRes.message)

      setData(()=>{
        return{
          image: "",
          name: "",
          number: "",
          user: "",
          description: "",
          qrcode: "",
          calc: "",
        }
      })

    }else {
      toast("Enter required fields")
    }
  }

  const uploadImage = async(e) =>{
    const data = await ImagetoBase64(e.target.files[0])
    setData((preve)=>{
      return{
        ...preve,
        image : data
      }
    })
  }
  const uploadQrcode = async(e) =>{
    const data = await ImagetoBase64(e.target.files[0])
    setData((preve)=>{
      return{
        ...preve,
        qrcode : data
      }
    })
  }

  return (
    <div className="admin-deposit">
      <div className="side-bar">
        <Sidebar />
      </div>
      <div className="admin-deposit-page">
        <TopNav />

        <button className="add-method-btn" onClick={handleShowAddmethod}>ADD NEW DEPOSIT METHOD</button>
        
        <div className="admin-deposit-body admin-tables-body">
  
        {showAddmethod && (
          <div className="method-position">
            <div className="new-method">
              <IoMdClose onClick={handleShowAddmethod} className="method-close"/>

              <form action="" onSubmit={handleSubmit}>

                <div className="admin-deposit-imgs">
                <div className="flex-img">
              <label htmlFor="image" id="image">Image</label>
                <div className="image">
                  {data.image? <img src={data.image}/> : <span><IoMdCloudUpload/></span>}
                    <input id="image" accept="image/*" name = "image" onChange={uploadImage} type="file"/>
                </div>
                </div>

                <div className="flex-qrcode">
                <label htmlFor="qrcode" id="qrcode">Qr Code</label>
                <div className="image">
                  {data.qrcode? <img src={data.qrcode}/> : <span><IoMdCloudUpload/></span>}
                    <input id="qrcode" accept="image/*" name = "qrcode" onChange={uploadQrcode} type="file"/>
                </div>
                </div>
                </div>

                <label htmlFor="name">Name</label>
                <input type="text" name="name" onChange={handleOnchange} value = {data.name}/>

                <label htmlFor="number">Number</label>
                <input type="text" name="number" onChange={handleOnchange} value = {data.number}/>

                <label htmlFor="user">User</label>
                <input type="text" name="user" onChange={handleOnchange} value = {data.user}/>

                <label htmlFor="calc">Value</label>
                <input type="number" name="calc" onChange={handleOnchange} value = {data.calc}/>

                <label htmlFor="description">Add a description</label>
                <input type="text" name="description" onChange={handleOnchange} value = {data.description}/>

                <button>ADD</button>
              </form>

            </div>
          </div>
        )}

        <div className="deposit-list">
        <AdminMethodTable/>
        </div>

        </div>
      </div>
    </div>
  );
};

export default AdmindepositMethod;
