import { configureStore, applyMiddleware } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import depositSlice from './depositSlice'
import methodSliceReducer from './methodSlice'
import withdrawalSlice from './withdrawalSlice'
import statsSlice from './accountStatsSlices'
import tradeSlice from './tradeSlice'
import percSlice from './percSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        deposit: depositSlice,
        method : methodSliceReducer,
        withdrawal: withdrawalSlice, 
        statistics: statsSlice, 
        trading: tradeSlice, 
        perc: percSlice, 
    },
})

