import {Post} from "../components/Post/Post"
import {CommentsBlock} from "../components/CommentsBlock"
import {AddComment} from "../components/AddComment/AddComment"
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "../axios"
import ReactMarkdown from "react-markdown";
import {useSelector} from "react-redux";

export const FullPost = () => {
    const [data, setData] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const {id} = useParams()
    const commentsItems = useSelector(state => state.comments.items)
    const users = useSelector(state => state.users.items)

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
    return <>
        <Post
            _id={data._id}
            title={data.title}
            imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
            user={data && data.user}
            createdAt={data.createdAt}
            viewsCount={data.viewsCount}
            commentsCount={3}
            tags={data.tags}
            isFullPost
        >
            {data && <ReactMarkdown children={data.text}/>}
        </Post>
        {data && (
            <CommentsBlock
                items={commentsItems}
                users={users}
                isLoading={isLoading}
            >
                <AddComment postId={id}/>
            </CommentsBlock>
        )}
    </>
}