import styles from "./Post.module.scss"
import {IconButton} from "@mui/material"
import DeleteIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import {Link} from "react-router-dom"
import {PostSkeleton} from './Skeleton'
import {UserInfo} from "../UserInfo/UserInfo"
import clsx from "clsx"
import {useDispatch, useSelector} from "react-redux"
import {fetchRemovePost} from "../../redux/slices/posts"
import {setUserInfoId} from "../../redux/slices/users";

export const Post = ({
                         _id, title, isFullPost, isEditable, imageUrl, tags, children, viewsCount,
                         isLoading, user, createdAt
                     }) => {
    const dispatch = useDispatch()
    const commentsItems = useSelector(state => state.comments.items)
    const commentsOfThisPost = commentsItems.filter((item) => item.postId === _id)

    if (isLoading) {
        return <PostSkeleton/>
    }
    const onRemove = () => {
        if (window.confirm('Вы действительно хотите удалить статью?')) {
            dispatch(fetchRemovePost(_id))
        }
    }
    return <div className={clsx(styles.root, {[styles.rootFull]: isFullPost})}>
        {
            isEditable && (
                <div className={styles.editButtons}>
                    <Link to={`/posts/${_id}/edit`}>
                        <IconButton color="primary">
                            <EditIcon/>
                        </IconButton>
                    </Link>
                    <IconButton onClick={onRemove} color="secondary">
                        <DeleteIcon/>
                    </IconButton>
                </div>
            )}
        {imageUrl && isFullPost
            ? <img className={clsx(styles.image, {[styles.imageFull]: isFullPost})}
                   src={imageUrl} alt={title}/>
            : imageUrl && !isFullPost
                ? <Link to={`/posts/${_id}`}>
                    <img className={clsx(styles.image, {[styles.imageFull]: isFullPost})}
                         src={imageUrl} alt={title}/>
                </Link>
                : null}
        <div className={styles.wrapper}>
            <Link to={`/user-info/${user._id}`} >
                <UserInfo {...user} additionalText={createdAt}/>
            </Link>

            <div className={styles.indention}>
                <h2 className={clsx(styles.title, {[styles.titleFull]: isFullPost})}>
                    {isFullPost ? title : <Link to={`/posts/${_id}`}>{title}</Link>}
                </h2>
                <ul className={styles.tags}>
                    {tags.map(name => (
                        <li key={name}>
                            <Link to={`/tag/${name}`}>#{name}</Link>
                        </li>
                    ))}
                </ul>
                {children && <div className={styles.content}>{children}</div>}
                <ul className={styles.postDetails}>
                    <li>
                        <EyeIcon/>
                        <span>{viewsCount}</span>
                    </li>
                    <li>
                        <CommentIcon/>
                        <span>{commentsOfThisPost.length}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
}