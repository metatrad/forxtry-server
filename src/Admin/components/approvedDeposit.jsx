import React, { useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVerifiedDepositAction } from '../../redux/depositSlice';
import AdminDepositCard from './adminDepositcard'
import AdminUserCard from './adminUsercard';
import '../adminStyles/table.css'
import Pagination from './pagination';
import currencyFormatter from '../../utilities/currencyFormatter';
import dateFormatter from './dateFormatter';
import { useState } from 'react';
import { mirage } from 'ldrs'

mirage.register()

const AdminPDepositTable = () => {

  const [ page, setPage ] = useState(1)

const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(fetchVerifiedDepositAction(+page))
    },[dispatch, page, setPage])

    const userData = useSelector(state => state?.user?.userAuth);
 
  const allDeposit = useSelector(state => state?.deposit) 
  const {loading, appErr, serverErr, depositList} = allDeposit;


  //filter only deposits
  const depositListCard = depositList?.docs?.filter(el => el.status === "approved",[]) 
  const loadingArray = new Array(1).fill(null)

  return (
    <TableContainer className = "admin-table">
      <Table sx={{ minWidth: 350 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className='tableCell'>Email</TableCell>
            <TableCell className='tableCell'>Date</TableCell>
            <TableCell className='tableCell'>Method</TableCell>
            <TableCell className='tableCell'>Amount</TableCell>
            <TableCell className='tableCell'>Transaction ID</TableCell>
          </TableRow>
        </TableHead>

        <TableBody className='table-body'>
        {loading? <h1 className='deposit-loading'>Loading...</h1>: appErr || serverErr? <div>{appErr}{serverErr}</div>: depositList?.docs?.length <= 0? <h1 className='deposit-loading' style={{color: "white"}}>No deposits found.</h1>: depositList?.docs?.map((el)=>{
            return(
                
                        <TableRow item = {el} key={el?._id}>
                        <TableCell className='tableCell'>{el?.user?.email}</TableCell>
                        <TableCell className='tableCell'>{dateFormatter(el?.createdAt)}</TableCell>
                        <TableCell className='tableCell'>{el?.method}</TableCell>
                        <TableCell className='tableCell'>
                          <div  className='table-cell-div'>
                            {currencyFormatter("USD",el?.amount)}
                            <span className={`status ${el?.status}`}>{el?.status}</span>
                          </div>
                        </TableCell>     
                        <TableCell className="tableCell id-cell">
                           <div className="view-btn">View</div>
                           <AdminDepositCard id = {el?._id}></AdminDepositCard>
                        </TableCell>     
                      </TableRow>
        )})}
                      <Pagination setPage={setPage} currentPage={page} pageNumber = {depositList?.totalPages}/>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default AdminPDepositTable;

