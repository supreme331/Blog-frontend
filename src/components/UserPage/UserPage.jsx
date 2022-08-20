import {useDispatch, useSelector} from "react-redux"
import {Avatar, Button, CircularProgress, Container, Grid, TextField, Typography} from "@mui/material"
import {useForm} from "react-hook-form"
import styles from "./UserPage.module.scss"
import axios from "../../axios"
import {useEffect, useState} from "react"
import {setUserInfoId} from "../../redux/slices/users";

export const UserPage = () => {
    const dispatch = useDispatch()
    const authData = useSelector(state => state.auth.data)
    const userId = useSelector(state => state.users.userInfoId)
    const userIdFromQuery = window.location.pathname.split("/")[2]
    const user = useSelector(state => state.users.items).filter(user => user._id === userId)[0]
    const [fullName, setFullName] = useState(user?.fullName)
    const [email, setEmail] = useState(user?.email)
    const [avatarUrl, setAvatarUrl] = useState(user?.email)
    const [registerAt, setRegisterAt] = useState(user?.createdAt)

    const isOwner = authData?._id === user?._id
    console.log(user)

    useEffect(() => {
        dispatch(setUserInfoId({id: userIdFromQuery}))
        setFullName(user?.fullName)
        setEmail(user?.email)
        setAvatarUrl(user?.avatarUrl)
        setRegisterAt(user?.createdAt)
    }, [user, userId])


    const [isUserDataUpdated, setIsUserDataUpdated] = useState(false)

    const {register, handleSubmit, formState: {errors, isValid}} = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            avatarUrl: '',
            password: ''
        },
        mode: "all"
    })

    const onSubmit = async (values) => {

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

    return user ? (<Container style={{marginTop: "20px"}}>
        {isOwner ? (<Grid container spacing={4}>
            <Grid xs={3} item rowSpacing={4}>
                <Avatar alt={user?.fullName} src={user?.avatarUrl} sx={{width: 200, height: 200}}/>
            </Grid>
            <Grid xs={9} item>
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <Grid columns={1} container spacing={4}>
                        <Grid xs={3} item rowSpacing={4}>
                            <TextField
                                error={Boolean(errors.fullName?.message)}
                                helperText={errors.fullName?.message}
                                label={"Полное имя"}
                                size="small"
                                variant="outlined"
                                value={fullName}
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
                                value={email}
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
                                value={avatarUrl}
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
                    <Avatar alt={user?.fullName} src={user?.avatarUrl} sx={{width: 200, height: 200}}/>
                </Grid>
                <Grid xs={9} item>
                    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                        <Grid columns={1} container spacing={4}>
                            <Grid xs={3} item rowSpacing={4}>
                                <Typography variant="h6" gutterBottom>
                                    {fullName}
                                </Typography>
                            </Grid>
                            <Grid xs={3} item rowSpacing={4}>
                                <Typography variant="subtitle1" gutterBottom>
                                    E-Mail: {email}
                                </Typography>
                            </Grid>
                            <Grid xs={3} item rowSpacing={4}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Зарегистрирован: {(new Date(registerAt)).toDateString()}
                                </Typography>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        )}
    </Container>) : (<CircularProgress />)
}