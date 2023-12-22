import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit';
import axios from "axios";
import baseURL from '../utilities/baseURL';

export const resetPercUpdated = createAction("admintransactions/reset")


//perc action
export const percAction = createAsyncThunk("/perc", async (payload, { rejectWithValue, getState, dispatch })=>{
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
        const { data } = await axios.post(`${baseURL}/perc`, payload, config);
        localStorage.setItem('perc', JSON.stringify(data));
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});

//fetch perc
export const fetchAllPercAction = createAsyncThunk("/admintransaction/fetch", async (payload, { rejectWithValue, getState, dispatch })=>{
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
        const { data } = await axios.get(`${baseURL}/admintransaction`,config);
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});

//update perc
export const updatePercAction = createAsyncThunk("/admintransactions/update", async (payload, { rejectWithValue, getState, dispatch })=>{
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
        const { data } = await axios.put(`${baseURL}/admintransactions/${payload?.id}`, payload, config);
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});

const percSlice = createSlice({
    name: 'perc',
    initialState: {},
    extraReducers:(builder)=>{
        //create perc
        builder.addCase(percAction.pending,(state, action)=>{
            state.loading = true;
        })
        builder.addCase(percAction.fulfilled,(state, action)=>{
            state.loading = false;
            state.percCreated = action?.payload;
            state.appErr = undefined;
            state.serverErr = undefined; 

        // // Update localStorage
        // localStorage.setItem('userInfo', JSON.stringify({
        //     ...JSON.parse(localStorage.getItem('userInfo')),
        //     balance:action?.payload?.balance,
        // }));
        })
        builder.addCase(percAction.rejected,(state, action)=>{
            state.loading = false;
            state.appErr = action?.payload?.msg;
            state.serverErr = action?.error?.msg; 
        })

        //fetch perc
        builder.addCase(fetchAllPercAction.pending,(state, action)=>{
            state.loading = true;
        })
        builder.addCase(fetchAllPercAction.fulfilled,(state, action)=>{
            state.loading = false;
            state.percList = action?.payload;
            state.appErr = undefined;
            state.serverErr = undefined; 
        })
        builder.addCase(fetchAllPercAction.rejected,(state, action)=>{
            state.loading = false;
            state.appErr = action?.payload?.msg;
            state.serverErr = action?.error?.msg; 
        })

         // update perc action
        builder.addCase(updatePercAction.pending,(state,action)=>{
            state.loading = true;
            state.appErr = undefined;
            state.serverErr = undefined;
        });
        //reset action
        builder.addCase(resetPercUpdated, (state, action)=>{
            state.isPercUpdated = true
        })
        //handle success state
        builder.addCase(updatePercAction.fulfilled, (state, action)=>{
            state.percUpdated = action?.payload;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
            state.isPercUpdated = false;
            localStorage.setItem('userInfo', JSON.stringify({
                ...JSON.parse(localStorage.getItem('userInfo')),
                perc:action?.payload?.perc,
            }));
        })
        //handle rejected state
        builder.addCase(updatePercAction.rejected, (state, action)=>{
            state.loading = false;
            state.appErr = action?.payload?.msg;
            state.serverErr = action?.error?.msg;
        })
    }
});

export default percSlice.reducer