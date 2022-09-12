import React, {useRef, useState} from "react"
import {SideBlock} from "../SideBlock/SideBlock"
import {
    Avatar, Box,
    Button,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Skeleton,
    TextField, Tooltip, Typography
} from "@mui/material"
import {Link} from "react-router-dom"
import axios from "../../axios"
import {useDispatch, useSelector} from "react-redux"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Clear"
import {fetchComments, fetchRemoveComment} from "../../redux/slices/comments"
import styles from "./CommentsBlock.module.scss"

export const CommentsBlock = ({fromHome = false, isAuth, items, users,
                                  children, isLoading = true, title}) => {

    const userData = useSelector(state => state.auth.data)
    const isMobile = useSelector(state => state.auth.isMobile)
    const dispatch = useDispatch()

    const onRemove = (_id) => {
        if (window.confirm('Вы действительно хотите удалить комментарий?')) {
            console.log('log from component', _id)
            dispatch(fetchRemoveComment(_id))
        }
    }

    return <SideBlock title={title}>
        {!isAuth && !fromHome ? <Box className={styles.infoMessage}><Typography component="span">
            Авторизуйтесь чтобы написать комментарий
        </Typography></Box> : null}
        <List>
            {(isLoading ? [...Array(5)] : items).map((obj, index) => {
                let user = users.find(user => user._id === obj.user)

                return <Comment
                    key={index}
                    fromHome={fromHome}
                    isMobile={isMobile}
                    isLoading={isLoading}
                    user={user}
                    item={obj}
                    index={index}
                    onRemove={onRemove}
                    isEditable={userData?._id === user?._id}
                />
            })}
        </List>
        {children}
    </SideBlock>
}

const Comment = ({fromHome, isMobile, isLoading, user, item, onRemove, isEditable}) => {

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

    return <React.Fragment>
        <ListItem className={styles.commentItems} alingItems="flex-start">
            {isEditable && (
                <div ref={commentEditBtnsRef} className={isMobile ? styles.editCommentsMobile : styles.editComments}>
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
                    <Link to={`/user-info/${user?._id}`}>
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
                        fromHome ? (<Tooltip title="К статье"><Link to={`/posts/${item.postId}`}>
                            <ListItemText style={{color: "#343434"}} primary={user?.fullName} secondary={item?.text}/>
                        </Link></Tooltip>) : (<ListItemText primary={user?.fullName} secondary={item?.text}/>)
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