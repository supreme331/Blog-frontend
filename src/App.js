import { Routes, Route } from 'react-router-dom'
import {Container} from "@mui/material";
import {Header} from "./components/Header/Header";
import {Home} from "./Pages/Home";
import {FullPost} from "./Pages/FullPost";
import {AddPost} from "./Pages/AddPost/AddPost";
import {Login} from "./Pages/Login/Login";
import {Registration} from "./Pages/Registration/Registration";

function App() {
    return (
        <>
            <Header/>
            <Container maxWidth="lg">
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/posts/:id' element={<FullPost/>}/>
                    <Route path='/add-post' element={<AddPost/>}/>
                    <Route path='/login' element={<Login />}/>
                    <Route path='/register' element={<Registration/>}/>
                </Routes>
            </Container>
        </>
    );
}

export default App;
