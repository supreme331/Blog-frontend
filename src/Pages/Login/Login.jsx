import styles from "./Login.module.scss"
import {Button, Paper, TextField, Typography} from "@mui/material"
import {useForm} from "react-hook-form"
import {useDispatch, useSelector} from "react-redux"
import {fetchAuth, selectIsAuth} from "../../redux/slices/auth"
import {Navigate} from "react-router-dom"

export const Login = () => {
    const isAuth = useSelector(selectIsAuth)
    const dispatch = useDispatch()
    const {register, handleSubmit, formState: {errors, isValid}} = useForm({
        defaultValues: {
            email: '',
            password: ''
        },
        mode: "all"
    })
    const onSubmit = async (values) => {
        const data = await dispatch(fetchAuth(values))
        if (!data.payload) {
            return alert('Не удалось авторизоваться!')
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
            Вход в аккаунт
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                type="email"
                className={styles.field}
                label="E-Mail"
                error={Boolean(errors.email?.message)}
                helperText={errors.email?.message}
                {...register('email', {required: 'Укажите почту'})}
                fullWidth
            />
            <TextField
                className={styles.field}
                label="Пароль"
                fullWidth
                error={Boolean(errors.password?.message)}
                helperText={errors.password?.message}
                {...register('password', {required: 'Введите пароль'})}
            />
            <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
                Войти
            </Button>
        </form>
    </Paper>
}