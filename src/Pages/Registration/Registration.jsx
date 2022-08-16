import styles from './Registration.module.scss'
import {Avatar, Paper, TextField, Typography, Button} from "@mui/material"
import {useDispatch, useSelector} from "react-redux"
import {fetchRegister, selectIsAuth} from "../../redux/slices/auth"
import {useForm} from "react-hook-form"
import {Navigate} from "react-router-dom"

export const Registration = () => {
    const isAuth = useSelector(selectIsAuth)
    const dispatch = useDispatch()
    const {register, handleSubmit, formState: {errors, isValid}} = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            avatarUrl: ''
        },
        mode: "all"
    })

    const onSubmit = async (values) => {
        const data = await dispatch(fetchRegister(values))
        if (!data.payload) {
            return alert('Не удалось зарегистрироваться!')
        }
        if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token)
        }
    }

    if (isAuth) {
        return <Navigate to='/'/>
    }

    return <Paper classes={{root: styles.root}}>
        <Typography classes={{root: styles.title}} variant="h5">
            Создание аккаунта
        </Typography>
        <div className={styles.avatar}>
            <Avatar sx={{width: 100, height: 100}}/>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                error={Boolean(errors.fullName?.message)}
                helperText={errors.fullName?.message}
                {...register('fullName', {required: 'Укажите полное имя'})}
                className={styles.field}
                label="Полное имя"
                fullWidth/>
            <TextField
                error={Boolean(errors.email?.message)}
                helperText={errors.email?.message}
                type="email"
                {...register('email', {required: 'Укажите имя'})}
                className={styles.field}
                label="E-Mail"
                fullWidth/>
            <TextField
                error={Boolean(errors.password?.message)}
                helperText={errors.password?.message}
                type="password"
                {...register('password', {required: 'Укажите пароль'})}
                className={styles.field}
                label="Пароль"
                fullWidth/>
            <TextField
                error={Boolean(errors.avatarUrl?.message)}
                helperText={errors.avatarUrl?.message}
                {...register('avatarUrl')}
                className={styles.field}
                label="Ссылка на аватар"
                fullWidth/>
            <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
                Зарегистрироваться
            </Button>
        </form>
    </Paper>
}