import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
    Typography
} from "@mui/material"
import {Link} from "react-router-dom"
import styles from "./Header.module.scss"
import {logout, selectIsAuth} from "../../redux/slices/auth"
import {useDispatch, useSelector} from "react-redux"
import {setUserInfoId} from "../../redux/slices/users"
import logo from "../../img/logo.svg"
import {initializationApp} from "../../App"
import {useState} from "react"
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'

export const Header = ({isInit, setIsInit}) => {

    const isAuth = useSelector(selectIsAuth)
    const userData = useSelector(state => state.auth.data)
    const isMobile = useSelector(state => state.auth.isMobile)
    const dispatch = useDispatch()

    return <Container className={styles.root} maxWidth="lg">
        <div className={styles.inner}>
            <Link onClick={() => {
                setIsInit(false)
                initializationApp(dispatch).then(() => setIsInit(true))
            }
            } to="/" className={styles.logo}>
                <img src={logo} alt="Кабанов блог"/>
            </Link>
            {isInit && <HeaderMenu isAuth={isAuth} userData={userData} isMobile={isMobile} dispatch={dispatch}/>}
        </div>
    </Container>
}

const HeaderMenu = ({isAuth, userData, isMobile, dispatch}) => {

    const [anchorElUser, setAnchorElUser] = useState(null)

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }

    const onLogout = () => {
        handleCloseUserMenu()
        if (window.confirm('Вы действительно хотите выйти?')) {
            dispatch(logout())
            window.localStorage.removeItem('token')
        }
    }

    return isAuth ? <>
        <Box sx={{flexGrow: 0}}>
            <Tooltip title="Жми">
                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                    <Avatar alt={userData?.fullName}
                            src={userData?.avatarUrl}
                            sx={isMobile ? {width: 30, height: 30} : {width: 50, height: 50}}/>
                </IconButton>
            </Tooltip>
            <Menu
                sx={{mt: '45px'}}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <MenuItem onClick={handleCloseUserMenu}>
                    <Link to={`/user-info/${userData._id}`} onClick={() => {
                        dispatch(setUserInfoId({id: userData._id}))
                    }}>
                        <Typography variant="h6" component="div">
                            {userData?.fullName}
                        </Typography>
                    </Link>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                    <Link className={styles.addPostLink} to="/add-post">
                        <AddCircleRoundedIcon color="primary"/>
                        <Typography component="span">
                            Написать статью
                        </Typography>
                    </Link>
                </MenuItem>
                <MenuItem onClick={onLogout}>
                    <LogoutRoundedIcon color="primary"/>
                    <Typography component="span">
                        Выйти
                    </Typography>
                </MenuItem>

            </Menu>
        </Box>
    </> : <Box className={styles.buttons}>
        <ButtonGroup
            variant="outlined"
        >
            <Button size="small"><Link to="/register">Регистрация</Link></Button>
            <Button variant="contained" size="small"><Link to="/login">Войти</Link></Button>
        </ButtonGroup>
    </Box>
}