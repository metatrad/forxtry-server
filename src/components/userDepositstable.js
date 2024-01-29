import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { userProfileAction } from "../redux/userSlice";
import { useSelector, useDispatch } from "react-redux";
import currencyFormatter from '../utilities/currencyFormatter';
import dateFormatter from '../Admin/components/dateFormatter'
import Pagination from '../Admin/components/pagination'
import '../Admin/adminStyles/table.css'

const UserDepositTable = () => {

    const [ page, setPage ] = useState(1)

    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(userProfileAction(+page))
    },[dispatch, page, setPage])

    const state = useSelector(state => state?.user);
    const {userLoading, userAppErr, userServerErr, profile } = state

    const deposits = profile?.deposit || [];

    const transactions = [...deposits];

  const userData = useSelector((state) => state.user);


  return (
    <TableContainer className = "admin-table">
      <Table sx={{ minWidth: 350 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className='tableCell'>Date</TableCell>
            <TableCell className='tableCell'>Status</TableCell>
            <TableCell className='tableCell'>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className='table-body'>
        {userLoading? <h1 className='deposit-loading'><l-mirage size="80" speed="2.5" color="white"></l-mirage></h1>: userAppErr || userServerErr? <div>{userAppErr}{userServerErr}</div>: transactions?.length <= 0? <h1 className='deposit-loading' style={{color: "white"}}>You haven't made any deposits yet.</h1>: transactions?.map(exp =>{
            return(
                        <TableRow item = {exp} key={exp?._id}>
                        <TableCell className='tableCell'>{dateFormatter(exp?.createdAt)}</TableCell>
                        <TableCell className='tableCell row-cell'><div className='table-cell-div'><span className={`status ${exp?.status}`}>{exp?.status}</span></div></TableCell>
                        <TableCell className='tableCell row-cell'><div className='table-cell-div'><span>{currencyFormatter("usd",exp?.amount)}</span> {exp?.method}</div></TableCell>        
                      </TableRow>
        )})}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default UserDepositTable;