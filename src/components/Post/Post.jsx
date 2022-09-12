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

export const Post = ({
                         _id, title, isFullPost, isEditable, imageUrl, tags, children, viewsCount,
                         isLoading, user, createdAt, searchRequestCallBack = () => {}
                     }) => {

    const dispatch = useDispatch()
    const commentsItems = useSelector(state => state.comments.items)
    const commentsOfThisPost = commentsItems.filter((item) => item.postId === _id)
    const isMobile = useSelector(state => state.auth.isMobile)

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
                <div className={isMobile ? styles.editButtonsMobile : styles.editButtons}>
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
        {
            isFullPost
                ? <PostData
                    user={user}
                    createdAt={createdAt}
                    isFullPost={isFullPost}
                    tags={tags}
                    title={title}
                    commentsOfThisPost={commentsOfThisPost}
                    viewsCount={viewsCount}
                    children={children}
                    searchRequestCallBack={searchRequestCallBack}
                    isMobile={isMobile}/>
                : <Link to={`/posts/${_id}`}>
                    <PostData
                        user={user}
                        createdAt={createdAt}
                        isFullPost={isFullPost}
                        tags={tags}
                        title={title}
                        commentsOfThisPost={commentsOfThisPost}
                        viewsCount={viewsCount}
                        children={children}
                        searchRequestCallBack={searchRequestCallBack}
                        isMobile={isMobile}/>
                </Link>
        }
        {
            imageUrl && !isFullPost
                ? (<Link to={`/posts/${_id}`}>
                    <img className={clsx(styles.image, {[styles.imageFull]: isFullPost})} src={imageUrl} alt={title}/>
                </Link>)
                : (<img className={clsx(styles.image, {[styles.imageFull]: isFullPost})} src={imageUrl} alt={title}/>)
        }

    </div>
}

const PostData = ({user, createdAt, isMobile, title, tags, viewsCount,
                      commentsOfThisPost, children, searchRequestCallBack}) => {
    return <div className={styles.wrapper}>

            <h2 className={isMobile ? styles.titleMobile : styles.title}>
                {title}
            </h2>
            <Link style={{display: "inline-block"}} to={`/user-info/${user._id}`}>
                <UserInfo {...user} additionalText={createdAt}/>
            </Link>
            <ul className={styles.tags}>
                {tags.map(name => (
                    <li key={name}>
                        <Link onClick={() => {searchRequestCallBack()}} to={`/tag/${name}`}>#{name}</Link>
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
}