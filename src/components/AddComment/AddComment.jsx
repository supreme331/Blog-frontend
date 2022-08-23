import styles from "./AddComment.module.scss"
import {Avatar, Button, TextField} from "@mui/material"
import axios from "../../axios"
import {useState} from "react"
import {fetchComments} from "../../redux/slices/comments"
import {useDispatch, useSelector} from "react-redux"

export const AddComment = ({postId}) => {

    const userData = useSelector(state => state.auth.data)
    const dispatch = useDispatch()
    const [text, setText] = useState()

    const onSubmit = async () => {
        try {
            const fields = {
                postId,
                text
            }
            await axios.post('/comments', fields)

        } catch (err) {
            console.warn(err)
            alert('Ошибка при отправке комментария!')
        }

        setText('')
        dispatch(fetchComments())
    }

    return <>
        <div className={styles.root}>
            <Avatar classes={{root: styles.avatar}}
                    src={userData?.avatarUrl}/>
            <div className={styles.form}>
                <TextField
                    label="Написать комментарий"
                    variant="outlined"
                    maxRows={10}
                    multiline
                    fullWidth
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value)
                    }}
                />
                <Button onClick={onSubmit} variant="contained">Отправить</Button>
            </div>
        </div>
    </>
}