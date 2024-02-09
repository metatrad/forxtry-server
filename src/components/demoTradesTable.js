import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import currencyFormatter from '../utilities/currencyFormatter';
import { userProfileAction } from "../redux/userSlice";
import dateFormatter from '../Admin/components/dateFormatter'
import { useSelector, useDispatch } from "react-redux";
import '../Admin/adminStyles/table.css'

const DemoTradestable = () => {


  const [ page, setPage ] = useState(1)

  const dispatch = useDispatch()
  useEffect(()=>{
      dispatch(userProfileAction(+page))
  },[dispatch, page, setPage])

  const state = useSelector(state => state?.user);
  const {userLoading, userAppErr, userServerErr, profile } = state

  const trades = profile?.demo || [];

  const transactions = [...trades];

  return (
    <TableContainer className = "admin-table">
      <Table sx={{ minWidth: 350 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className='tableCell'>Date</TableCell>
            <TableCell className='tableCell'>Stake</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className='table-body'>
        {userLoading? <h1 className='deposit-loading'>Loading...</h1>: userAppErr || userServerErr? <div>{userAppErr}{userServerErr}</div>: trades?.length <= 0? <h1 className='deposit-loading' style={{color: "white"}}>No trade history</h1>: transactions?.map(exp =>{
            return(
                        <TableRow item = {exp} key={exp?._id}>
                        <TableCell className='tableCell'>
                          <div className='table-cell-div'>
                           {dateFormatter(exp?.createdAt)}
                          <span className='trade-ends-span'>{exp?.expirationTime}</span>
                          </div>
                        </TableCell>

                        <TableCell className='tableCell row-cell'>
                          <div className='table-cell-div'>
                            {currencyFormatter("usd",exp?.investment)} 
                            <span className={`status ${exp?.tradeResult}`}>
                              {currencyFormatter("usd",exp?.calculatedResult)}
                            </span>
                          </div>
                        </TableCell>    
                      </TableRow>
                      
        )})}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DemoTradestable
