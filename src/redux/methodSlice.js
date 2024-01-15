import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from "axios";
import baseURL from '../utilities/baseURL';
const initialState = {
    methodList : []
}

//fetch all action
export const fetchAllMethodAction = createAsyncThunk("/admindepositall", async (payload, { rejectWithValue, getState, dispatch })=>{
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
        const { data } = await axios.get(`${baseURL}/admindepositall?page=${payload}`,config);
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});

//update withdrawal action
export const updateMethodAction = createAsyncThunk("/admindepositupdate", async (payload, { rejectWithValue, getState, dispatch })=>{
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
        const { data } = await axios.put(`${baseURL}/admindepositupdate/${payload?.id}`, payload, config);
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});

export const methodSlice = createSlice({
    name : "method",
    initialState,
    reducers : {
        setDataMethod : (state,action)=>{
            state.methodList = [...action.payload]
        },
        deleteMethodSuccess: (state, action) => {
            state.depositList = state.depositList.filter((method) => method._id !== action.payload);
          },
    },  
    extraReducers:(builder)=>{
        //fetch withdrawal
        builder.addCase(fetchAllMethodAction.pending,(state, action)=>{
            state.loading = true;
        })
        builder.addCase(fetchAllMethodAction.fulfilled,(state, action)=>{
            state.loading = false;
            state.methodallList = action?.payload;
            state.appErr = undefined;
            state.serverErr = undefined; 
        })
        builder.addCase(fetchAllMethodAction.rejected,(state, action)=>{
            state.loading = false;
            state.appErr = action?.payload?.msg;
            state.serverErr = action?.error?.msg; 
        })

        //update deposit
        builder.addCase(updateMethodAction.pending,(state, action)=>{
            state.loading = true;
            state.ismethodUpdated = false;
        })
        builder.addCase(updateMethodAction.fulfilled,(state, action)=>{
            state.loading = false;
            state.methodUpdated = action?.payload;
            state.appErr = undefined;
            state.serverErr = undefined;
            state.ismethodUpdated = true;
        })
        builder.addCase(updateMethodAction.rejected,(state, action)=>{
            state.loading = false;
            state.appErr = action?.payload?.msg || "Unknown app error";
            state.serverErr = action?.error?.msg || "Unknown server error"; 
        })
    }
})

export const { deleteMethodSuccess } = methodSlice.actions;

export const deleteMethodAction = (id) => async (dispatch) => {
    try {
      // Make a DELETE request to your backend API
      await axios.delete(`${baseURL}/admindepositdelete/${id}`);
      // Dispatch the success action with the deleted method ID
      dispatch(deleteMethodSuccess(id));
    } catch (error) {
      // Handle errors or dispatch an error action
      console.error('Error deleting method:', error);
    }
  };

export const {setDataMethod} = methodSlice.actions

export default methodSlice.reducer