import React, {useEffect, useRef, useState} from "react"
import {SideBlock} from "./SideBlock/SideBlock"
import {
    Avatar, Button,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Skeleton,
    TextField
} from "@mui/material"
import axios from "../axios";
import {useDispatch, useSelector} from "react-redux";
import styles from "./Post/Post.module.scss";
import {Link} from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Clear";
import {fetchRemovePost} from "../redux/slices/posts";
import {fetchComments, fetchRemoveComment} from "../redux/slices/comments";


export const CommentsBlock = ({items, users, children, isLoading = true}) => {

    const dispatch = useDispatch()

    const onRemove = (_id) => {
        if(window.confirm('Вы действительно хотите удалить комментарий?')) {
            console.log('log from component', _id)
            dispatch(fetchRemoveComment(_id))
        }
    }



    return <SideBlock title="Комментарии">
        <List>
            {(isLoading ? [...Array(5)] : items).map((obj, index) => {
                let user = users.find(user => user._id === obj.user)
                return <Comment isLoading={isLoading}
                                user={user}
                                obj={obj}
                                index={index}
                                onRemove={onRemove}
                />
            })}
        </List>
        {children}
    </SideBlock>
}

const Comment = ({isLoading, user, obj, index, onRemove}) => {
    const ref = useRef(null)
    const dispatch = useDispatch()
    const [text, setText] = useState(obj.text)
    const onEdit = () => {
    ref.current.style.display = 'flex'
    }
    const onSubmit = async () => {
        try {
            const fields = {
                text
            }
            await axios.patch(`/comments/${obj._id}`, fields)
        }
    catch (err) {
            console.warn(err)
            alert('Ошибка при изменении комментария!')
        }
        dispatch(fetchComments())
        ref.current.style.display = 'none'
    }
    return <React.Fragment key={index}>
        <ListItem alingItems="flex-start">
            <div className={styles.editComments}>

                <IconButton onClick={()=> {onEdit()}} color="primary">
                    <EditIcon />
                </IconButton>

                <IconButton onClick={()=> {onRemove(obj._id)}} color="secondary" >
                    <DeleteIcon />
                </IconButton>
            </div>
            <ListItemAvatar>
                {isLoading ? (
                    <Skeleton variant="circular" width={40} height={40}/>
                ) : (
                    <Avatar alt={user.fullName} src={user.avatarUrl}/>
                )}
            </ListItemAvatar>
            {isLoading ? (
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <Skeleton variant="text" width={120} height={25}/>
                    <Skeleton variant="text" width={230} height={18}/>
                </div>
            )  : (
                <div>
                    <ListItemText  primary={user.fullName} secondary={obj.text}/>
                    <div ref={ref} style={{display: 'none'}}>
                        <TextField
                            // defaultValue={obj.text}
                            value={text}
                            onChange={(e) => {setText(e.target.value)}}
                        />
                        <Button onClick={onSubmit} variant="contained">Сохранить</Button>
                    </div>
                </div>
            )}
        </ListItem>
        <Divider variant="inset" component="li"/>
    </React.Fragment>
}