import React from "react";
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { deleteMethodAction } from '../../redux/methodSlice';
import '../adminStyles/table.css'

const Methodcard = ({name,image,qrcode,number,user, calc, description, id }) => {

  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteMethodAction(id));
  };

  return (
    <div>
      <div className="admin-deposit-card-wrapper">
      <Link to={`/admindepositmethod/${id}`}>
        <div className="admin-deposit-card wrapper-method">
            <img src={image} alt="" />
            <p>{name}</p>
        </div>
        </Link>
        <button className="delete-btn-method" onClick={handleDelete}>Delete</button>
        </div>
    </div>
  );
};

export default Methodcard;