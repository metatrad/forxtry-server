import './App.css';
import {BrowserRouter as Router,Routes,Route,RouterProvider} from 'react-router-dom'
import { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from './components/protectedRoute'
import Home from './pages/home'
import Signup from './pages/SignUp'
import Login from './pages/Login'
import FAQ from './pages/FAQ'
import About from './pages/about'
import Trading from './pages/trading'
import Demo from './pages/demo'
import Account from './pages/account';
import Deposit from './pages/deposit';
import Admin from './Admin/pages/admin'
import AdminWithdrawal from './Admin/pages/Adminwithdrawal'
import AdminDeposit from './Admin/pages/Admindeposit'
import AdminDepositMethod from './Admin/pages/adminDepositMethod'
import AdminUsers from './Admin/pages/users'
import AdminPendingUsers from './Admin/pages/pendingusers'
import AdminVerifiedUsers from './Admin/pages/verifiedusers'
import AdminVdeposit from './Admin/pages/verifiedDeposits';
import AdmindVwithdrawal from './Admin/pages/verifiedWithdrawals';
import Single from './Admin/pages/Single';
import DepositMenu from './pages/depositMenu';
import AdminTransactions from './Admin/pages/transactions'
import Analytics from './pages/analytics'
import { Toaster } from 'react-hot-toast';
import { setDataMethod } from './redux/methodSlice';
import Withdrawal from './pages/withdrawal';
import NotAdmin from './components/notAdmin';
import AdminRoute from './components/adminRoute';
import Editdeposit from './Admin/pages/edit-deposit';
import Editwithdrawal from './Admin/pages/edit-withdrawal';
import Test from './pages/test'
import Editperc from './Admin/pages/edit-perc';
import Trades from './pages/trades';
import DemoTrades from './pages/demoTrades';
import UserDeposit from './pages/userDeposit'
import UserWithdrawal from './pages/userWithdrawal'
import Editmethod from './Admin/pages/edit-method'
import ForgotP from './pages/forgot-password'
import Otp from './pages/otp'
import './LDM/light.css'
import { LightModeContext } from './context/lightModeContext';

function App() {

  const {lightMode} = useContext(LightModeContext)

  const dispatch = useDispatch()
  const methodData = useSelector((state)=>state.method)
  useEffect(()=>{
    (async()=>{
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/admindeposit`)
      const resData =  await res.json()
      dispatch(setDataMethod(resData))
    })()
  },[])

  return (
    <>
    <Toaster />
    <div className={lightMode? "app light":"app"}>

      <div className="pages">
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/chart-server' element={<Test/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/forgot-password' element={<ForgotP/>}/>
          <Route path='/otp' element={<Otp/>}/>
          <Route path='/faq' element={<FAQ/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/userdeposit' element={<UserDeposit/>}/>
          <Route path='/userwithdrawal' element={<UserWithdrawal/>}/>
          <Route path='/trades' element={<Trades/>}/>
          <Route path='/demoTrades' element={<DemoTrades/>}/>

          <Route path='/not-admin' element={<NotAdmin/>}/>
          <Route path='/trading' element={<ProtectedRoute/>}>
            <Route path='/trading' element = {<Trading/>}/>
          </Route>

          <Route path='/demo' element={<ProtectedRoute/>}>
            <Route path='/demo' element = {<Demo/>}/>
          </Route>
          
          <Route path='/account' element={<Account/>}/>
          <Route path='/deposit' element={<Deposit/>}/>
          <Route path='/depositmenu/:filterby' element={<DepositMenu/>}/>
          <Route path='/analytics' element={<Analytics/>}/>

          <Route path='/admintransactions'>
            <Route index element={<AdminTransactions/>}/>
            <Route path=':filterby' element={<Editperc/>}/>
          </Route>

          <Route path='/admindepositmethod/:filterby' element={<Editmethod/>}/>

          <Route path='/withdrawal' element={<ProtectedRoute/>}>
            <Route path='/withdrawal' element = {<Withdrawal/>}/>
          </Route>

          {/* //////fornow */}
          <Route path='/admin' element={<AdminRoute/>}>
            <Route path='/admin' element={<Admin/>}/>
          </Route>

          <Route path='/adminusers' element={<AdminRoute/>}>
            <Route path='/adminusers' element={<AdminUsers/>}/>
          </Route>
          <Route path='/adminusers'>
            <Route index element={<AdminUsers/>}/>
            <Route path=':filterby' element={<Single/>}/>
          </Route>

          <Route path='/pendingusers' element={<AdminRoute/>}>
            <Route path='/pendingusers' element={<AdminPendingUsers/>}/>
          </Route>
          <Route path='/pendingusers'>
            <Route index element={<AdminPendingUsers/>}/>
            <Route path=':filterby' element={<Single/>}/>
          </Route>

          <Route path='/verifiedusers' element={<AdminRoute/>}>
            <Route path='/verifiedusers' element={<AdminVerifiedUsers/>}/>
          </Route>
          <Route path='/verifiedusers'>
            <Route index element={<AdminVerifiedUsers/>}/>
            <Route path=':filterby' element={<Single/>}/>
          </Route>

          <Route path='/admindeposit' element={<AdminRoute/>}>
            <Route path='/admindeposit' element={<AdminDeposit/>}/>
          </Route>
          <Route path='/admindeposit'>
            <Route index element={<AdminDeposit/>}/>
            <Route path=':filterby' element={<Editdeposit/>}/>
          </Route>

          <Route path='/approveddeposit' element={<AdminRoute/>}>
            <Route path='/approveddeposit' element={<AdminVdeposit/>}/>
          </Route>
          <Route path='/approveddeposit'>
            <Route index element={<AdminVdeposit/>}/>
            <Route path=':filterby' element={<Editdeposit/>}/>
          </Route>

          <Route path='/admindepositmethod' element={<AdminRoute/>}>
            <Route path='/admindepositmethod' element={<AdminDepositMethod/>}/>
          </Route>
          {/* <Route path='/admindeposit'>
            <Route index element={<AdminDeposit/>}/>
            <Route path=':filterby' element={<Editdeposit/>}/>
          </Route> */}

          <Route path='/adminwithdrawal' element={<AdminRoute/>}>
            <Route path='/adminwithdrawal' element={<AdminWithdrawal/>}/>
          </Route>
          <Route path='/adminwithdrawal'>
            <Route index element={<AdminWithdrawal/>}/>
            <Route path=':filterby' element={<Editwithdrawal/>}/>
          </Route>

          <Route path='/approvedwithdrawal' element={<AdminRoute/>}>
            <Route path='/approvedwithdrawal' element={<AdmindVwithdrawal/>}/>
          </Route>
          <Route path='/approvedwithdrawal'>
            <Route index element={<AdmindVwithdrawal/>}/>
            <Route path=':filterby' element={<Editwithdrawal/>}/>
          </Route>

        </Routes>
      </Router>  
      </div>

    </div>
    </>

  );
}

export default App;
