import {Avatar, Button, Container, Typography} from "@mui/material"
import {Link} from "react-router-dom"
import styles from "./Header.module.scss"
import {logout, selectIsAuth} from "../../redux/slices/auth"
import {useDispatch, useSelector} from "react-redux"
import {setUserInfoId} from "../../redux/slices/users";

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
    return <div className={styles.root}>
        <Container maxWidth="lg">
            <div className={styles.inner}>
                <Link to="/" className={styles.logo}>
                    Блог Кабанова Василия
                </Link>
                {isAuth && <Link to={`/user-info`} onClick={() => {dispatch(setUserInfoId({id: userData._id}))}} className={styles.authInfo}>
                    <Avatar alt={userData?.fullName} src={userData?.avatarUrl}/>
                    <Typography className={styles.fullName} variant="h6" gutterBottom component="div">
                        {userData?.fullName}
                    </Typography>
                </Link>}
                <div className={styles.buttons}>
                    {isAuth ? (<>

                        <Link to="/add-post">
                            <Button variant="contained">Написать статью</Button>
                        </Link>
                        <Button onClick={onLogout} variant="contained" color="error">Выйти</Button>
                    </>) : (
                        <>
                            <Link to="/login">
                                <Button variant="outlined">Войти</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="contained">Регистрация</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </Container>
    </div>
}