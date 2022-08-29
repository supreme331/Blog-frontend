import {Route, Routes} from 'react-router-dom'
import {Container} from "@mui/material"
import {Header} from "./components/Header/Header"
import {Home} from "./Pages/Home"
import {FullPost} from "./Pages/FullPost/FullPost"
import {AddPost} from "./Pages/AddPost/AddPost"
import {Login} from "./Pages/Login/Login"
import {Registration} from "./Pages/Registration/Registration"
import {fetchAuthMe} from "./redux/slices/auth"
import {useEffect} from "react"
import {useDispatch} from "react-redux"
import {fetchComments} from "./redux/slices/comments"
import {fetchUsers} from "./redux/slices/users"
import {SearchPageContainer} from "./Pages/SearchPage"
import {UserPage} from "./components/UserPage/UserPage"
import {fetchPosts, fetchTags} from "./redux/slices/posts"

export const initializationApp = (dispatch) => {
    dispatch(fetchAuthMe())
    dispatch(fetchUsers())
    dispatch(fetchComments())
    dispatch(fetchPosts())
    dispatch(fetchTags())
}

function App() {
    const dispatch = useDispatch()

    useEffect(() => {
        initializationApp(dispatch)
    }, [])

    return <>
        <Header/>
        <Container maxWidth="lg">
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/posts/:id' element={<FullPost/>}/>
                <Route path='/posts/:id/edit' element={<AddPost/>}/>
                <Route path='/add-post' element={<AddPost/>}/>
                <Route path='/tag/:tagName' element={<SearchPageContainer/>}/>
                <Route path='/search' element={<SearchPageContainer/>}/>
                <Route path='/user-info/:id' element={<UserPage/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Registration/>}/>
            </Routes>
        </Container>
    </>
}

export default App;
