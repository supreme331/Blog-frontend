import {Button, Container} from "@mui/material"
import {Link} from "react-router-dom"
import styles from "./Header.module.scss"

export const Header = () => {
    const isAuth = false
    const onLogout = () => {}
    return <div className={styles.root}>
        <Container maxWidth="lg">
            <div className={styles.inner}>
                <Link to="/" className={styles.logo}>
                    <div>Блог Кабанова Василия</div>
                </Link>
                <div className={styles.buttons}>
                    {isAuth ? (<>
                        <Link to="/post/create">
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