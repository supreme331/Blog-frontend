import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from "../../axios"

export const fetchComments = createAsyncThunk('comments/fetchComments', async () => {
    const { data } = await axios.get('/comments')
    return data
})

export const fetchRemoveComment = createAsyncThunk('comments/fetchRemoveComment', async (id) => {
        await axios.delete(`/comments/${id}`)
})

const initialState = {
    items: [],
    status: 'loading',
}

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: {
        //Получение комментариев
        [fetchComments.pending]: (state) => {
            state.items = []
            state.status = 'loading'
        },
        [fetchComments.fulfilled]: (state, action) => {
            state.items = action.payload
            state.status = 'loaded'
        },
        [fetchComments.rejected]: (state) => {
            state.items = []
            state.status = 'error'
        },
        //Удаление комментария
        [fetchRemoveComment.pending]: (state, action) => {
            state.items = state.items.filter(obj => obj._id !== action.meta.arg)
        },
    }
})

export const commentsReducer = commentSlice.reducer