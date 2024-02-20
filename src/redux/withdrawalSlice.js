import { createAsyncThunk, createSlice,createAction } from '@reduxjs/toolkit';
import axios from "axios";
import baseURL from '../utilities/baseURL';
import { updateBalance } from './userSlice';

//actions for refreshing
export const resetWithdrawalCreated = createAction("withdrawal/reset")
export const resetWithdrawalUpdated = createAction("adminwithdrawal/reset")

//withdrawal otp
export const withdrawalOtpAction = createAsyncThunk("/withdrawalotp", async (payload, { rejectWithValue, getState, dispatch })=>{
    //get user token from store
    const userToken = getState()?.user?.userAuth?.token;
    const config = {
        headers:{
            'Content-Type': 'application/json',
            Authorization : `Bearer ${userToken}`
        },
    };
    try {
        //http call
        const { data } = await axios.post(`${baseURL}/withdrawalotp`, payload, config);
        return data;
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});

//withdrawal action
export const withdrawalAction = createAsyncThunk("/withdrawal", async (payload, { rejectWithValue, getState, dispatch })=>{
    //get user token from store
    const userToken = getState()?.user?.userAuth?.token;
    const config = {
        headers:{
            'Content-Type': 'application/json',
            Authorization : `Bearer ${userToken}`
        },
    };
    try {
        //http call
        const { data } = await axios.post(`${baseURL}/withdrawal`, payload, config);
        dispatch(resetWithdrawalCreated())
        dispatch(updateBalance(data.balance));
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});

//fetch all action
export const fetchAllWithdrawalAction = createAsyncThunk("/withdrawal/fetch", async (payload, { rejectWithValue, getState, dispatch })=>{
    //get user token from store
    const userToken = getState()?.user?.userAuth?.token;
    const config = {
        headers:{
            'Content-Type': 'application/json',
            Authorization : `Bearer ${userToken}`
        },
    };
    try {
        //http call
        const { data } = await axios.get(`${baseURL}/withdrawal?page=${payload}`,config);
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});
//fetch v action
export const fetchVerifiedWithdrawalAction = createAsyncThunk("/withdrawalverified/fetch", async (payload, { rejectWithValue, getState, dispatch })=>{
    //get user token from store
    const userToken = getState()?.user?.userAuth?.token;
    const config = {
        headers:{
            'Content-Type': 'application/json',
            Authorization : `Bearer ${userToken}`
        },
    };
    try {
        //http call
        const { data } = await axios.get(`${baseURL}/withdrawalverified?page=${payload}`,config);
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});

//update withdrawal action
export const updateWithdrawalAction = createAsyncThunk("/adminwithdrawal/update", async (payload, { rejectWithValue, getState, dispatch })=>{
    //get user token from store
    const userToken = getState()?.user?.userAuth?.token;
    const config = {
        headers:{
            'Content-Type': 'application/json',
            Authorization : `Bearer ${userToken}`
        },
    };
    try {
        //http call
        const { data } = await axios.put(`${baseURL}/adminwithdrawal/${payload?.id}`, payload, config);
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});

const withdrawalSlice = createSlice({
    name: 'withdrawal',
    initialState: {},
    extraReducers:(builder)=>{
        //create otp withdrawal
        builder.addCase(withdrawalOtpAction.pending,(state, action)=>{
            state.loading = true;
        })
        builder.addCase(withdrawalOtpAction.fulfilled,(state, action)=>{
            state.loading = false;
            state.withdrawalOtpSent = action?.payload;
            state.OtpErr = action?.payload?.message;
            state.serverOtpErr = action?.payload?.message; 
            state.isWithdrawalOtpSent = false
        })
        builder.addCase(withdrawalOtpAction.rejected,(state, action)=>{
            state.loading = false;
            state.OtpErr = action?.payload?.message;
            state.serverOtpErr = action?.error?.message; 
        })

        //create withdrawal
        builder.addCase(withdrawalAction.pending,(state, action)=>{
            state.loading = true;
        })
        //reset action
        builder.addCase(resetWithdrawalCreated, (state, action)=>{
            state.isWithdrawalCreated = true
        })
        builder.addCase(withdrawalAction.fulfilled,(state, action)=>{
            state.loading = false;
            state.withdrawalCreated = action?.payload;
            state.appErr = action?.payload?.message;
            state.serverErr = action?.payload?.message; 
            state.isWithdrawalCreated = false
  
        // Update localStorage
        localStorage.setItem('userInfo', JSON.stringify({
            ...JSON.parse(localStorage.getItem('userInfo')),
            balance:action?.payload?.balance,
        }));
        })
        builder.addCase(withdrawalAction.rejected,(state, action)=>{
            state.loading = false;
            state.appErr = action?.payload?.message;
            state.serverErr = action?.error?.message; 
        })

        //fetch withdrawal
        builder.addCase(fetchAllWithdrawalAction.pending,(state, action)=>{
            state.loading = true;
        })
        builder.addCase(fetchAllWithdrawalAction.fulfilled,(state, action)=>{
            state.loading = false;
            state.withdrawalList = action?.payload;
            state.appErr = undefined;
            state.serverErr = undefined; 
        })
        builder.addCase(fetchAllWithdrawalAction.rejected,(state, action)=>{
            state.loading = false;
            state.appErr = action?.payload?.msg;
            state.serverErr = action?.error?.msg; 
        })

        //fetch v withdrawal
        builder.addCase(fetchVerifiedWithdrawalAction.pending,(state, action)=>{
            state.loading = true;
        })
        builder.addCase(fetchVerifiedWithdrawalAction.fulfilled,(state, action)=>{
            state.loading = false;
            state.withdrawalList = action?.payload;
            state.appErr = undefined;
            state.serverErr = undefined; 
        })
        builder.addCase(fetchVerifiedWithdrawalAction.rejected,(state, action)=>{
            state.loading = false;
            state.appErr = action?.payload?.msg;
            state.serverErr = action?.error?.msg; 
        })

        //update deposit
        builder.addCase(updateWithdrawalAction.pending,(state, action)=>{
            state.loading = true;
        })
        builder.addCase(updateWithdrawalAction.fulfilled,(state, action)=>{
            state.loading = false;
            state.withdrawalUpdated = action?.payload;
            state.appErr = undefined;
            state.serverErr = undefined;
            state.isWithdrawalUpdated = false;
 
        })
        builder.addCase(updateWithdrawalAction.rejected,(state, action)=>{
            state.loading = false;
            state.appErr = action?.payload?.msg || "Unknown app error";
            state.serverErr = action?.error?.msg || "Unknown server error"; 
        })
    }
});

export default withdrawalSlice.reducer