import styles from "./Login.module.scss"
import {Button, Paper, TextField, Typography} from "@mui/material";

export const Login = () => {
    return <Paper classes={{ root: styles.root }}>
        <Typography classes={{ root: styles.title }} variant="h5">
            Всход в аккаунт
        </Typography>
        <TextField
            className={styles.field}
            label="E-Mail"
            error
            helperText="Неверно указана почта"
            fullWidth
        />
        <TextField className={styles.field} label="Пароль" fullWidth/>
        <Button size="large" variant="contained" fullWidth>
            Войти
        </Button>
    </Paper>
}