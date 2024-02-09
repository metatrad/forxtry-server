import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit';
import axios from "axios";
import baseURL from '../utilities/baseURL';

//actions for refreshing
export const resetUserUpdated = createAction("/users/update")
export const resetUserAdminUpdated = createAction("/adminusers/update")
export const otpReset = createAction("/login/otp")

//signup action
export const signupAction = createAsyncThunk("/signup", async (payload, { rejectWithValue, getState, dispatch })=>{
    const config = {
        headers:{
            'Content-Type': 'application/json',
        },
    };
    try {
        //http call
        const { data } = await axios.post(`${baseURL}/signup`, payload, config);
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});

//login action
export const loginAction = createAsyncThunk("/login", async (payload, { rejectWithValue, getState, dispatch })=>{
    const config = {
        headers:{
            'Content-Type': 'application/json',
        },
    };
    try {
        //http call
        const { data } = await axios.post(`${baseURL}/login`, payload, config);
        // //save browser into local storage
        // localStorage.setItem('userInfo', JSON.stringify(data));
        dispatch(otpReset())
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});

//forgot password
export const forgotPAction = createAsyncThunk("/forgot-password", async (payload, { rejectWithValue, getState, dispatch })=>{
    const config = {
        headers:{
            'Content-Type': 'application/json',
        },
    };
    try {
        //http call
        const { data } = await axios.post(`${baseURL}/forgot-password`, payload, config);
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});

  //otp action
  export const loginWithOTP = createAsyncThunk("/loginWithOTP", async (payload, { rejectWithValue, getState, dispatch })=>{
    const config = {
        headers:{
            'Content-Type': 'application/json',
        },
    };
    try {
        //http call
        const { data } = await axios.post(`${baseURL}/otp`, payload, config);

        //save browser into local storage
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});
//delete account
  export const deleteAccount = createAsyncThunk("/user/delete", async (payload, { rejectWithValue, getState, dispatch })=>{
    const config = {
        headers:{
            'Content-Type': 'application/json',
        },
    };
    try {
        //http call
        const { data } = await axios.delete(`${baseURL}/deleteuser`, payload, config);

        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});

//update localstorage
export const updateStorage = createAsyncThunk()

//logout
export const logout = createAsyncThunk('/logout', async(payload,{rejectWithValue, getState, dispatch }) =>{
    try {
        localStorage.removeItem('userInfo');
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
})


//fetch all action
export const fetchAllUserAction = createAsyncThunk("/adminusers/fetch", async (payload, { rejectWithValue, getState, dispatch })=>{
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
        const { data } = await axios.get(`${baseURL}/adminusers?page=${payload}`,config);
        return data;
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});
//fetch pending action
export const fetchPendingUserAction = createAsyncThunk("/adminuserspending/fetch", async (payload, { rejectWithValue, getState, dispatch })=>{
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
        const { data } = await axios.get(`${baseURL}/adminuserspending?page=${payload}`,config);
        return data;
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});
//fetch verified action
export const fetchVerifiedUserAction = createAsyncThunk("/adminusersverified/fetch", async (payload, { rejectWithValue, getState, dispatch })=>{
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
        const { data } = await axios.get(`${baseURL}/adminusersverified?page=${payload}`,config);
        return data;
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});


  //update user action
export const updateUserAction = createAsyncThunk("/adminusers/update", async (payload, { rejectWithValue, getState, dispatch })=>{
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
        const { data } = await axios.put(`${baseURL}/adminusers/${payload?.id}`, payload, config);
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});


////profile action
export const userProfileAction = createAsyncThunk("/profile", async (payload, { rejectWithValue, getState, dispatch })=>{
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
        const { data } = await axios.get(`${baseURL}/profile`, config);
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});
//// update profile action
export const updateProfileAction = createAsyncThunk("/account", async (payload, { rejectWithValue, getState, dispatch })=>{
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
        const { data } = await axios.put(`${baseURL}/account`,{
            image: payload?. image,
            verification: payload?. verification,
            firstName: payload?. firstName,
            lastName: payload?. lastName,
            phone: payload?. phone,
            status: payload?. status,
            email: payload?. email,
            address: payload?. address,
            dob: payload?. dob,
            country: payload?.country ,
            withdrawalCode: payload?.withdrawalCode ,
        }, config);
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});

//get user from local storage and place in store
const userLoginFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')):undefined;

//slices
const userSlice = createSlice({
    name: 'users',
    initialState: {
        userAuth: userLoginFromStorage,
        balance: userLoginFromStorage?.balance,
        demoBalance: userLoginFromStorage?.demoBalance,
        userLoading: false,
        userAppErr: undefined,
        userServerErr: undefined,
    },
    reducers: {
        updateBalance: (state, action) => {
            state.userAuth.balance = action?.payload;
        },
        updateDemoBalance: (state, action) => {
            state.userAuth.demoBalance = action?.payload;
        },
        updateTrade: (state, action) => {
            state.profile.trade = action?.payload;
        },
    }, 
    extraReducers: (builder) =>{
        //login action
        //handle pending state
        builder.addCase(loginAction.pending,(state, action)=>{
            state.userLoading = true;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        });
        builder.addCase(otpReset, (state, action)=>{
            state.isOtpSent = true
        })
        //handle success state
        builder.addCase(loginAction.fulfilled, (state, action)=>{
            state.otpSent = action?.payload;
            state.userLoading = false;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
            state.isOtpSent = false
        })
        //handle rejected state
        builder.addCase(loginAction.rejected, (state, action)=>{
            state.userLoading = false;
            state.userAppErr = action?.payload?.msg;
            state.userServerErr = action?.error?.msg;
        })

        //forgot password
        //handle pending state
        builder.addCase(forgotPAction.pending,(state, action)=>{
            state.userLoading = true;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        });
        //handle success state
        builder.addCase(forgotPAction.fulfilled, (state, action)=>{
            state.linkSent = action?.payload;
            state.userLoading = false;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        })
        //handle rejected state
        builder.addCase(forgotPAction.rejected, (state, action)=>{
            state.userLoading = false;
            state.userAppErr = action?.payload?.msg;
            state.userServerErr = action?.error?.msg;
        })

                // otp login action
        //handle pending state
        builder.addCase(loginWithOTP.pending,(state, action)=>{
            state.userLoading = true;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        });
        //handle success state
        builder.addCase(loginWithOTP.fulfilled, (state, action)=>{
            state.userAuth = action?.payload;
            state.balance = action?.payload?.balance
            state.userLoading = false;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        })
        //handle rejected state
        builder.addCase(loginWithOTP.rejected, (state, action)=>{
            state.userLoading = false;
            state.userAppErr = action?.payload?.msg;
            state.userServerErr = action?.error?.msg;

        })

        //delete account
        //handle pending state
        builder.addCase(deleteAccount.pending,(state, action)=>{
            state.userLoading = true;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        });
        //handle success state
        builder.addCase(deleteAccount.fulfilled, (state, action)=>{
            state.userDeleted = action?.payload;
            state.userLoading = false;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        })
        //handle rejected state
        builder.addCase(deleteAccount.rejected, (state, action)=>{
            state.userLoading = false;
            state.userAppErr = action?.payload?.msg;
            state.userServerErr = action?.error?.msg;

        })

        //signup action
        //handle pending state
        builder.addCase(signupAction.pending,(state,action)=>{
            state.userLoading = true;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        });
        //handle success state
        builder.addCase(signupAction.fulfilled, (state, action)=>{
            state.isRegistered = action?.payload;
            state.userLoading = false;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        })
        //handle rejected state
        builder.addCase(signupAction.rejected, (state, action)=>{
            state.userLoading = false;
            state.userAppErr = action?.payload?.msg;
            state.userServerErr = action?.error?.msg;
        })

        //logout
        builder.addCase(logout.fulfilled,(state,action)=>{
            state.userAuth = undefined;
            state.userLoading = false;
        })

        //fetch action
        //handle pending state
        builder.addCase(fetchAllUserAction.pending,(state,action)=>{
            state.userLoading = true;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        });
        //handle success state
        builder.addCase(fetchAllUserAction.fulfilled, (state, action)=>{
            state.userLoading = false;
            state.userList = action?.payload;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        })
        //handle rejected state
        builder.addCase(fetchAllUserAction.rejected, (state, action)=>{
            state.userLoading = false;
            state.userAppErr = action?.payload?.msg;
            state.userServerErr = action?.error?.msg;

        })

        //fetch pending action
        //handle pending state
        builder.addCase(fetchPendingUserAction.pending,(state,action)=>{
            state.userLoading = true;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        });
        //handle success state
        builder.addCase(fetchPendingUserAction.fulfilled, (state, action)=>{
            state.userLoading = false;
            state.userList = action?.payload;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        })
        //handle rejected state
        builder.addCase(fetchPendingUserAction.rejected, (state, action)=>{
            state.userLoading = false;
            state.userAppErr = action?.payload?.msg;
            state.userServerErr = action?.error?.msg;

        })
        //fetch verified action
        //handle pending state
        builder.addCase(fetchVerifiedUserAction.pending,(state,action)=>{
            state.userLoading = true;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        });
        //handle success state
        builder.addCase(fetchVerifiedUserAction.fulfilled, (state, action)=>{
            state.userLoading = false;
            state.userList = action?.payload;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        })
        //handle rejected state
        builder.addCase(fetchVerifiedUserAction.rejected, (state, action)=>{
            state.userLoading = false;
            state.userAppErr = action?.payload?.msg;
            state.userServerErr = action?.error?.msg;

        })

        //profile action
        //handle pending state
        builder.addCase(userProfileAction.pending,(state,action)=>{
            state.userLoading = true;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        });
        //handle success state
        builder.addCase(userProfileAction.fulfilled, (state, action)=>{
            state.profile = action?.payload;
            state.userLoading = false;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        })
        //handle rejected state
        builder.addCase(userProfileAction.rejected, (state, action)=>{
            state.userLoading = false;
            state.userAppErr = action?.payload?.msg;
            state.userServerErr = action?.error?.msg;
        })

        // update profile action
        //handle pending state
        builder.addCase(updateProfileAction.pending,(state,action)=>{
            state.userLoading = true;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        });
        builder.addCase(resetUserUpdated, (state, action)=>{
            state.isUserCreated = true
        })
        //handle success state
        builder.addCase(updateProfileAction.fulfilled, (state, action)=>{
            state.isUserCreated = false
            state.userUpdate = action?.payload;
            state.userLoading = false;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
                          // Update localStorage
        localStorage.setItem('userInfo', JSON.stringify({
            ...JSON.parse(localStorage.getItem('userInfo')),
            email: action?.payload?.email,
            firstName: action?.payload?.firstName,
            lastName: action?.payload?.lastName,
            image: action?.payload?.image,
            verification: action?.payload?.verification,
            phone: action?.payload?.phone,
            country: action?.payload?.country,
            address: action?.payload?.address,
            dob: action?.payload?.dob,
            currency: action?.payload?.currency,
            withdrawalCode: action?.payload?.withdrawalCode,
        }));
        })
        //handle rejected state
        builder.addCase(updateProfileAction.rejected, (state, action)=>{
            state.userLoading = false;
            state.userAppErr = action?.payload?.msg;
            state.userServerErr = action?.error?.msg;
        })


        // update user action
        //handle user state
        builder.addCase(updateUserAction.pending,(state,action)=>{
            state.userLoading = true;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        });
        //handle success state
        builder.addCase(updateUserAction.fulfilled, (state, action)=>{
            state.userUpdated = action?.payload;
            state.userLoading = false;
            state.userAppErr = undefined;
            state.userServerErr = undefined;
        })
        //handle rejected state
        builder.addCase(updateUserAction.rejected, (state, action)=>{
            state.userLoading = false;
            state.userAppErr = action?.payload?.msg;
            state.userServerErr = action?.error?.msg;
        })
    }
    
})

export const { updateBalance } = userSlice.actions;
export const { updateDemoBalance } = userSlice.actions;
export const { updateTrade} = userSlice.actions;

export default userSlice.reducer;