import {configureStore} from "@reduxjs/toolkit"
import {postsReducer} from "./slices/posts"
import {authReducer} from "./slices/auth"
import {commentsReducer} from "./slices/comments"
import {usersReducer} from "./slices/users"

const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: authReducer,
        comments: commentsReducer,
        users: usersReducer
    }
})

export default store