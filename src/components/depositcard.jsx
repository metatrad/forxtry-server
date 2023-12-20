import React from "react";
import { Link } from 'react-router-dom'
import "../styles/deposit.css";

const Depositcard = ({image,name,description,number,user, id}) => {
  return (
    <div>
      <Link to={`/depositmenu/${id}`}>
        <div className="payment-methods-card">
            <img src={image} alt="" />
            <p>{name}</p>
            <p>{description}</p>
        </div>
        </Link>
    </div>
  );
};

export default Depositcard;
