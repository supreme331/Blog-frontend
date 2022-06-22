import styles from "./Post.module.scss"
import {IconButton} from "@mui/material"
import DeleteIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import {Link} from "react-router-dom"
import {PostSkeleton} from './Skeleton'
import {UserInfo} from "../UserInfo/UserInfo"
import clsx from "clsx";

export const Post = ({
                         _id, title, isFullPost, isEditable, imageUrl, tags, children, viewsCount,
                         commentsCount, isLoading, user, createdAt
                     }) => {
    if (isLoading) {
        return <PostSkeleton />
    }
    const onRemove = () => {

    }
    return <div className={clsx(styles.root, {[styles.rootFull]: isFullPost})}>
        {
            isEditable && (
                <div className={styles.editButtons}>
                    <Link to={`/posts/${_id}/edit`}>
                        <IconButton color="primary">
                            <EditIcon />
                        </IconButton>
                    </Link>
                    <IconButton onClick={onRemove} color="secondary" >
                        <DeleteIcon />
                    </IconButton>
                </div>
            )}
        {imageUrl && (
            <img className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
            src={imageUrl} alt={title}/>
        )}
        <div className={styles.wrapper}>
            <UserInfo {...user} additionalText={createdAt}/>
            <div className={styles.indention}>
                <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
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
                        <EyeIcon />
                        <span>{viewsCount}</span>
                    </li>
                    <li>
                        <CommentIcon />
                        <span>{commentsCount}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
}