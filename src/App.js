import {Route, Routes} from 'react-router-dom'
import {Container} from "@mui/material"
import {Header} from "./components/Header/Header"
import {Home} from "./Pages/HomePage/Home"
import {FullPost} from "./Pages/FullPost/FullPost"
import {AddPost} from "./Pages/AddPost/AddPost"
import {Login} from "./Pages/Login/Login"
import {Registration} from "./Pages/Registration/Registration"
import {fetchAuthMe, setDevice} from "./redux/slices/auth"
import {useEffect, useState} from "react"
import {useDispatch} from "react-redux"
import {fetchComments} from "./redux/slices/comments"
import {fetchUsers} from "./redux/slices/users"
import {SearchPageContainer} from "./Pages/SearchPage/SearchPage"
import {UserPage} from "./Pages/UserPage/UserPage"
import {fetchPosts, fetchTags} from "./redux/slices/posts"
import {isMobile} from 'react-device-detect'

export const initializationApp = async (dispatch) => {
     dispatch(setDevice({isMobile: isMobile}))
     if (window.localStorage.getItem('token')) {
         dispatch(fetchAuthMe())
     }
     dispatch(fetchUsers())
     dispatch(fetchComments())
     dispatch(fetchPosts())
     dispatch(fetchTags())
}

function App() {
    const dispatch = useDispatch()

    const [isInit, setIsInit] = useState(false)

    useEffect(() => {
        setIsInit(false)
        initializationApp(dispatch).then(() => setIsInit(true))
    }, [])

    return <>
        <Header isInit={isInit} setIsInit={setIsInit}/>
        <Container maxWidth="lg">
            <Routes>
                <Route path='/' element={<Home isInit={isInit}/>}/>
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
