import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Table from "../components/table";
import Sidebar from '../components/adminSideNav.jsx'
import toast from "react-hot-toast";
import TopNav from '../components/adminNav'
import Disabledbutton from "../../components/disabledbutton";
import { fetchAllPercAction } from "../../redux/percSlice";
import { updatePercAction } from "../../redux/percSlice";
import Perccard from "../components/perccard";
import '../adminStyles/transaction.css'

const Transactions = () => {

  const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(fetchAllPercAction())
    },[dispatch])

    const userData = useSelector(state => state?.user?.userAuth);
 
  const allPerc = useSelector(state => state?.perc) 
  const {loading, appErr, serverErr, percList} = allPerc;

  const loadingArray = new Array(1).fill(null)

  return (
    <div className="list-container">
      <div className="side-bar">
        <Sidebar />
      </div>
      <div className="list">
      <TopNav/>
      <div className="padding admin-tables-body">
      <div className="list-wrapper">
      <div className="list-title">Winning percentage</div>

      {loading? <h1 className='deposit-loading'><l-mirage size="80" speed="2.5" color="black"></l-mirage></h1>: appErr || serverErr? <div>{appErr}{serverErr}</div>: percList?.map((el)=>{
            return(
              <div className="perc-data-cover" item = {el} key={el?._id}>
                <div className="wrapper-perc">
                <div className='perc-data-num'>{el?.perc}%</div>
                <div className='perc-data-num-demo'>{el?.demoperc}%</div>
                </div>
                {/* <TableCell className="tableCell id-cell">
                            */}
                <div className='perc-data'>
                  <div className="view-btn">View</div>
                  <Perccard id = {el?._id}></Perccard></div>     
              </div>
        )})}
            
      </div>
      </div>
      </div>
    </div>
  );
};

export default Transactions;
