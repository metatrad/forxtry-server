import React from "react";
import { Link } from 'react-router-dom'
import '../adminStyles/table.css'

const Perccard = ({perc, id}) => {
  return (
    <div>
      <Link to={`/admintransactions/${id}`}>
        <div className="admin-deposit-card">
            <p>{id}</p>
            <p>{perc}</p>
        </div>
        </Link>
    </div>
  );
};

export default Perccard;