import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVerifiedUserAction } from '../../redux/userSlice';
import AdminUserCard from './adminUsercard';
import '../adminStyles/table.css';
import Pagination from './pagination';
import currencyFormatter from '../../utilities/currencyFormatter';

const VerifiedDataTable = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchVerifiedUserAction(+page));
  }, [dispatch, page, setPage]);


  const allUsers = useSelector((state) => state?.user);
  const { userAppErr, userServerErr, userList, userLoading, isUserUpdated } = allUsers;


  // Filter users based on search term
  const filteredUserList = userList?.docs?.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadingArray = new Array(1).fill(null);

  return (
    <div>
      {/* Search Input */}
      <input className='users-search-input'
        type="text"
        placeholder="Search by Email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Table Container */}
      <TableContainer className="admin-table">
        <Table sx={{ minWidth: 350 }} aria-label="simple table">
          {/* Table Header */}
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Email</TableCell>
              <TableCell className="tableCell">Balance</TableCell>
              <TableCell className="tableCell">Status</TableCell>
              <TableCell className="tableCell">ID</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody className="table-body">
            {userLoading ? (
              <h1 className="deposit-loading">
                Loading...
              </h1>
            ) : userAppErr || userServerErr ? (
              <div>Error</div>
            ) : filteredUserList?.length <= 0 ? (
              <h1 className="deposit-loading" style={{ color: 'white' }}>
                No users found.
              </h1>
            ) : (
              filteredUserList?.map((user) => (
                <TableRow item={user} key={user?._id}>
                  <TableCell className="tableCell">{user?.email}</TableCell>
                  <TableCell className="tableCell">
                    {currencyFormatter('USD', user?.balance)}
                  </TableCell>
                  <TableCell className="tableCell">
                    <span className={`status ${user?.status}`}>{user?.status}</span>
                  </TableCell>
                  <TableCell className="tableCell">
                    <AdminUserCard id={user?._id}></AdminUserCard>
                  </TableCell>
                </TableRow>
              ))
            )}
            <Pagination setPage={setPage} currentPage={page} pageNumber={userList?.totalPages} />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default VerifiedDataTable;
