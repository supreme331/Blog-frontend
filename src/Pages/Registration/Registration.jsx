import styles from './Registration.module.scss'
import {Avatar, Paper, TextField, Typography, Button} from "@mui/material"

export const Registration = () => {
    return <Paper >
        <Typography classes={{ root: styles.title }} variant="h5">
            Создание аккаунта
        </Typography>
        <div className={styles.avatar}>
            <Avatar sx={{width: 100, height: 100}}/>
        </div>
        <TextField className={styles.field} label="Полное имя" fullWidth/>
        <TextField className={styles.field} label="E-Mail" fullWidth/>
        <TextField className={styles.field} label="Пароль" fullWidth/>
        <Button size="large" variant="contained" fullWidth>
            Зарегистрироваться
        </Button>
    </Paper>
}