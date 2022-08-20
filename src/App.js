import {Route, Routes} from 'react-router-dom'
import {Container} from "@mui/material"
import {Header} from "./components/Header/Header"
import {Home} from "./Pages/Home"
import {FullPost} from "./Pages/FullPost"
import {AddPost} from "./Pages/AddPost/AddPost"
import {Login} from "./Pages/Login/Login"
import {Registration} from "./Pages/Registration/Registration"
import {fetchAuthMe, selectIsAuth} from "./redux/slices/auth"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {fetchComments} from "./redux/slices/comments"
import {fetchUsers} from "./redux/slices/users"
import {SearchPageContainer} from "./Pages/SearchPage"
import {UserPage} from "./components/UserPage/UserPage"

function App() {
    const dispatch = useDispatch()
    const isAuth = useSelector(selectIsAuth)

    useEffect(() => {
        dispatch(fetchAuthMe())
        dispatch(fetchUsers())
        dispatch(fetchComments())
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
