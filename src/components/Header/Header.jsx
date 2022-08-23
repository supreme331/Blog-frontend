import {Avatar, Button, Container, Typography} from "@mui/material"
import {Link} from "react-router-dom"
import styles from "./Header.module.scss"
import {logout, selectIsAuth} from "../../redux/slices/auth"
import {useDispatch, useSelector} from "react-redux"
import {setUserInfoId} from "../../redux/slices/users"
import logo from "../../img/logo.svg"

export const Header = () => {

    const isAuth = useSelector(selectIsAuth)
    const userData = useSelector(state => state.auth.data)
    const dispatch = useDispatch()

    const onLogout = () => {
        if (window.confirm('Вы действительно хотите выйти?')) {
            dispatch(logout())
            window.localStorage.removeItem('token')
        }
    }

    return <Container className={styles.root} maxWidth="lg">
        <div className={styles.inner}>
            <Link to="/" className={styles.logo}>
                <div>
                    <img src={logo} alt="Кабанов блог"/>
                </div>
            </Link>
            {isAuth && <Link to={`/user-info/${userData._id}`} onClick={() => {
                dispatch(setUserInfoId({id: userData._id}))
            }} className={styles.authInfo}>
                <Avatar alt={userData?.fullName} src={userData?.avatarUrl} sx={{width: 30, height: 30}}/>
                <Typography className={styles.fullName} variant="h6" component="div">
                    {userData?.fullName}
                </Typography>
            </Link>}
            <div className={styles.buttons}>
                {isAuth ? (<>

                    <Link to="/add-post">
                        <Button variant="outlined" size="small">Написать статью</Button>
                    </Link>
                    <Button onClick={onLogout} variant="contained" size="small">Выйти</Button>
                </>) : (
                    <>
                        <Link to="/login">
                            <Button variant="outlined" size="small">Войти</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="contained" size="small">Регистрация</Button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    </Container>
}