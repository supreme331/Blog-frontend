import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from "../../axios"

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const { data } = await axios.get('/users')
    return data
})

const initialState = {
    items: [],
    status: 'loading',
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: {
        //Получение пользователей
        [fetchUsers.pending]: (state) => {
            state.items = []
            state.status = 'loading'
        },
        [fetchUsers.fulfilled]: (state, action) => {
            state.items = action.payload
            state.status = 'loaded'
        },
        [fetchUsers.rejected]: (state) => {
            state.items = []
            state.status = 'error'
        },
    }
})

export const usersReducer = userSlice.reducer