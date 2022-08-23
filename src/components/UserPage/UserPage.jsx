import {useDispatch, useSelector} from "react-redux"
import {
    Button,
    CircularProgress,
    Container,
    Grid,
    TextField,
    Typography
} from "@mui/material"
import {useForm} from "react-hook-form"
import styles from "./UserPage.module.scss"
import axios from "../../axios"
import {useEffect, useState} from "react"
import {setUserInfoId} from "../../redux/slices/users"
import noAvatar from "../../img/noAvatar.PNG"

export const UserPage = () => {

    const dispatch = useDispatch()
    const authData = useSelector(state => state.auth.data)
    const userId = useSelector(state => state.users.userInfoId)
    const userIdFromQuery = window.location.pathname.split("/")[2]
    const user = useSelector(state => state.users.items).filter(user => user._id === userId)[0]
    const [fullName, setFullName] = useState(user?.fullName)
    const [email, setEmail] = useState(user?.email)
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl)
    const [registerAt, setRegisterAt] = useState(user?.createdAt)
    const [isTryingUpdateTestUser, setIsTryingUpdateTestUser] = useState(false)
    const [isUserDataUpdated, setIsUserDataUpdated] = useState(false)
    const isOwner = authData?._id === user?._id

    useEffect(() => {
        dispatch(setUserInfoId({id: userIdFromQuery}))
        setFullName(user?.fullName)
        setEmail(user?.email)
        setAvatarUrl(user?.avatarUrl)
        setRegisterAt(user?.createdAt)
    }, [user?._id, userId, userIdFromQuery])

    const {register, handleSubmit, formState: {errors, isValid}} = useForm({
        defaultValues: {
            fullName: fullName,
            email: email,
            avatarUrl: avatarUrl,
            password: ''
        },
        mode: "all"
    })

    const onSubmit = async (values) => {

        if (user._id === '62b1ca18f0fccd879562992c') {
            setIsTryingUpdateTestUser(true)
            setTimeout(() => {
                setIsTryingUpdateTestUser(false)
            }, 4000)
            return
        }

        const {data} = await axios.patch(`/users/${user?._id}`, values)
        if (!data.success) {
            console.log(data)
            return alert('Не удалось обновить данные пользователя!')
        } else if (data.success) {
            setIsUserDataUpdated(true)
            setTimeout(() => {
                setIsUserDataUpdated(false)
            }, 4000)
        }

        if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token)
        }
    }

    return user ? (<Container className={styles.root}>
        {isOwner ? (<Grid container spacing={4}>
            <Grid xs={4} item rowSpacing={4}>
                <img alt={user?.fullName}
                     src={user?.avatarUrl ? user.avatarUrl : noAvatar}
                     className={styles.avatar}/>
            </Grid>
            <Grid xs={8} item>
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <Grid columns={1} container spacing={4}>
                        <Grid xs={3} item rowSpacing={4}>
                            <TextField
                                error={Boolean(errors.fullName?.message)}
                                helperText={errors.fullName?.message}
                                label={"Полное имя"}
                                size="small"
                                variant="outlined"
                                {...register('fullName', {required: 'Введите полное имя'})}
                            />
                        </Grid>
                        <Grid xs={3} item rowSpacing={4}>
                            <TextField
                                error={Boolean(errors.email?.message)}
                                helperText={errors.email?.message}
                                type="email"
                                label={"E-Mail"}
                                size="small"
                                variant="outlined"
                                {...register('email', {required: 'Введите email'})}
                            />
                        </Grid>
                        <Grid xs={3} item rowSpacing={4}>
                            <TextField
                                error={Boolean(errors.avatarUrl?.message)}
                                helperText={errors.avatarUrl?.message}
                                label={"Ссылка на аватар"}
                                size="small"
                                variant="outlined"
                                {...register('avatarUrl')}
                            />
                        </Grid>
                        <Grid xs={3} item rowSpacing={4}>
                            <TextField
                                error={Boolean(errors.password?.message)}
                                helperText={errors.password?.message}
                                label={"Пароль"}
                                size="small"
                                variant="outlined"
                                type="password"
                                {...register('password', {required: 'Укажите пароль'})}
                            />
                        </Grid>
                        {
                            isTryingUpdateTestUser && <Grid xs={3} item rowSpacing={4}>
                                <div>Тестовый пользователь не может изменять авторизационные данные</div>
                            </Grid>
                        }
                        {
                            isUserDataUpdated && <Grid xs={3} item rowSpacing={4}>
                                <div>Данные пользователя обновлены</div>
                            </Grid>
                        }

                        <Grid xs={3} item rowSpacing={4}>
                            <Button disabled={!isValid} className={styles.item} type="submit"
                                    variant="outlined">Сохранить</Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>) : (<Grid container spacing={4}>
                <Grid xs={3} item rowSpacing={4}>
                    <img alt={user?.fullName}
                         src={user?.avatarUrl ? user.avatarUrl : noAvatar}
                         className={styles.avatar}/>
                </Grid>
                <Grid xs={9} item>
                    <Grid className={styles.userInfoBlock} columns={1} container spacing={4}>
                        <Grid xs={3} item rowSpacing={4}>
                            <Typography variant="h6">
                                {fullName}
                            </Typography>
                        </Grid>
                        <Grid xs={3} item rowSpacing={4}>
                            <Typography variant="subtitle1">
                                E-Mail: <a target="_blank" href={`mailto:${email}`} rel="noreferrer">
                                {email}
                            </a>
                            </Typography>
                        </Grid>
                        <Grid xs={3} item rowSpacing={4}>
                            <Typography variant="subtitle1">
                                Зарегистрирован: {(new Date(registerAt)).toDateString()}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )}
    </Container>) : (<CircularProgress/>)
}