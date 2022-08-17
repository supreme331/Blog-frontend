import {createSlice, createAsyncThunk, createAction} from "@reduxjs/toolkit"
import axios from "../../axios"

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const { data } = await axios.get('/users')
    return data
})
export const setUserInfoId = createAction('users/setUserInfoId')
setUserInfoId({id: ''})

const initialState = {
    items: [],
    status: 'loading',
    userInfoId: '',
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
        //Устанавливаем id пользователя для UserPage
        [setUserInfoId]: (state, action) => {
            state.userInfoId = action.payload.id
        }
    }
})

export const usersReducer = userSlice.reducer