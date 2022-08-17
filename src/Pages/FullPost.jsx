import {Post} from "../components/Post/Post"
import {CommentsBlock} from "../components/CommentsBlock"
import {AddComment} from "../components/AddComment/AddComment"
import {useParams} from "react-router-dom"
import {useEffect, useState} from "react"
import axios from "../axios"
import ReactMarkdown from "react-markdown"
import {useSelector} from "react-redux"
import {selectIsAuth} from "../redux/slices/auth"


export const FullPost = () => {
    const isAuth = useSelector(selectIsAuth)
    const authData = useSelector(state => state.auth.data)
    const [data, setData] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const {id} = useParams()
    const users = useSelector(state => state.users.items)
    const commentsItems = useSelector(state => state.comments.items)
    const commentsOfThisPost = commentsItems.filter((item) => item.postId === id)

    useEffect(() => {
        axios.get(`/posts/${id}`).then(res => {
            setData(res.data)
            setIsLoading(false)
        }).catch(err => {
            console.warn(err)
            alert('Ошибка при получении статьи')
        })
    }, [id])

    if (isLoading) {
        return <Post isLoading={isLoading}/>
    }
    return <div style={{width: "70%"}}>
        <Post
            _id={data._id}
            title={data.title}
            imageUrl={data.imageUrl ? `${process.env.REACT_APP_API_URL || "http://localhost:4444"}${data.imageUrl}` : ''}
            user={data && data.user}
            createdAt={(new Date(data.createdAt)).toUTCString()}
            viewsCount={data.viewsCount}
            tags={data.tags}
            isFullPost
            isEditable={authData?._id === data?.user._id}
        >
            {data && <ReactMarkdown children={data.text}/>}
        </Post>
        {data && (
            <CommentsBlock
                items={commentsOfThisPost}
                users={users}
                isLoading={isLoading}
                title={'Комментарии'}
            >
                {isAuth && <AddComment postId={id}/>}
            </CommentsBlock>
        )}
    </div>
}