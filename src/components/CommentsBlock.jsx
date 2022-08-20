import React, {useRef, useState} from "react"
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
import {Link} from "react-router-dom"
import axios from "../axios"
import {useDispatch, useSelector} from "react-redux"
import styles from "./Post/Post.module.scss"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Clear"
import {fetchComments, fetchRemoveComment} from "../redux/slices/comments"
import {setUserInfoId} from "../redux/slices/users"

export const CommentsBlock = ({items, users, children, isLoading = true, title}) => {
    const userData = useSelector(state => state.auth.data)
    const dispatch = useDispatch()

    const onRemove = (_id) => {
        if (window.confirm('Вы действительно хотите удалить комментарий?')) {
            console.log('log from component', _id)
            dispatch(fetchRemoveComment(_id))
        }
    }

    return <SideBlock title={title}>
        <List>
            {(isLoading ? [...Array(5)] : items).map((obj, index) => {
                let user = users.find(user => user._id === obj.user)
                return <Comment isLoading={isLoading}
                                user={user}
                                item={obj}
                                index={index}
                                onRemove={onRemove}
                                isEditable={userData?._id === user?._id}
                                title={title}
                />
            })}
        </List>
        {children}
    </SideBlock>
}

const Comment = ({isLoading, user, item, index, onRemove, isEditable, title}) => {
    const commentEditFormRef = useRef(null)
    const commentEditBtnsRef = useRef(null)
    const dispatch = useDispatch()
    const [text, setText] = useState(item.text)
    const onEdit = () => {
        commentEditFormRef.current.style.display === 'none'
            ? commentEditFormRef.current.style.display = 'flex'
            : commentEditFormRef.current.style.display = 'none'
    }
    const onSubmit = async () => {
        try {
            const fields = {
                text
            }
            await axios.patch(`/comments/${item._id}`, fields)
        } catch (err) {
            console.warn(err)
            alert('Ошибка при изменении комментария!')
        }
        dispatch(fetchComments())
        commentEditFormRef.current.style.display = 'none'
    }
    return <React.Fragment key={index}>
        <ListItem className={styles.commentItems} alingItems="flex-start">
            {isEditable && (<div ref={commentEditBtnsRef} className={styles.editComments}>
                <IconButton onClick={() => {
                    onEdit()
                }} color="primary">
                    <EditIcon/>
                </IconButton>
                <IconButton onClick={() => {
                    onRemove(item._id)
                }} color="secondary">
                    <DeleteIcon/>
                </IconButton>
            </div>)}

            <ListItemAvatar>
                {isLoading ? (
                    <Skeleton variant="circular" width={40} height={40}/>
                ) : (
                    <Link to={`/user-info/${user?._id}`} >
                        <Avatar alt={user?.fullName} src={user?.avatarUrl}/>
                    </Link>
                )}
            </ListItemAvatar>

            {isLoading ? (
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <Skeleton variant="text" width={120} height={25}/>
                    <Skeleton variant="text" width={230} height={18}/>
                </div>
            ) : (
                <div>
                    {
                        title === 'Последнии комментарии' ? (<Link to={`/posts/${item.postId}`}>
                            <ListItemText style={{color: "#343434"}} primary={user?.fullName} secondary={item?.text}/>
                        </Link>) : (<ListItemText primary={user?.fullName} secondary={item?.text}/>)
                    }
                    <div ref={commentEditFormRef} style={{display: 'none'}}>
                        <TextField
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value)
                            }}
                        />
                        <Button onClick={onSubmit} variant="contained">Сохранить</Button>
                    </div>
                </div>
            )}
        </ListItem>
        <Divider variant="inset" component="li"/>
    </React.Fragment>
}