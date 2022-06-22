import styles from "./AddComment.module.scss"
import {Avatar, Button, TextField} from "@mui/material";

export const Index = () => {
    return <>
        <div className={styles.root}>
            <Avatar classes={{root: styles.avatar}}
            src="https://mui.com/static/images/avatar/5.jpg"/>
            <div className={styles.form}>
                <TextField
                    label="Написать комментарий"
                    variant="outlined"
                    maxRows={10}
                    multiline
                    fullWidth/>
                <Button variant="contained">Отправить</Button>
            </div>
        </div>
    </>
}