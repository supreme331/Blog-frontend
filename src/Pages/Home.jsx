import {Grid, Tab, Tabs} from "@mui/material"
import {Post} from "../components/Post/Post"
import {TagsBlock} from "../components/TagsBlock/TagsBlock"
import {CommentsBlock} from "../components/CommentsBlock"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {fetchPosts, fetchTags} from "../redux/slices/posts";
import {SearchBlock} from "../components/SearchBlock/SearchBlock";

export const Home = () => {
    const users = useSelector(state => state.users.items)
    const dispatch = useDispatch()
    const userData = useSelector(state => state.auth.data)
    const {posts, tags} = useSelector(state => state.posts)
    const popularPostItems = [...posts.items].sort((a, b) => a.viewsCount - b.viewsCount)
    const tagsItems = Array.from(new Set(tags.items))
    const commentsItems = useSelector(state => state.comments.items)
    const [tabsValue, setTabsValue] = useState(0)
    const isPostsLoading = posts.status === 'loading'
    const isTagsLoading = tags.status === 'loading'
    const lastComments = [...commentsItems].reverse().slice(0, 5)

    const onSetTabsValue = (value) => {
        setTabsValue(value)
    }

    useEffect(() => {
        dispatch(fetchPosts())
        dispatch(fetchTags())
    }, [])

    return <>
        <Tabs value={tabsValue} aria-label="basic tabs example">
            <Tab onClick={() => {
                onSetTabsValue(0)
            }} label="Новые"/>
            <Tab onClick={() => {
                onSetTabsValue(1)
            }} label="Популярные"/>
        </Tabs>
        <Grid container spacing={4}>
            <Grid xs={8} item>
                {(isPostsLoading
                    ? [...Array(5)]
                    : tabsValue === 0
                        ? posts.items
                        : popularPostItems).map((obj, index) => isPostsLoading ? (
                    <Post key={index} isLoading={true}/>
                ) : (
                    <Post
                        _id={obj._id}
                        title={obj.title}
                        imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
                        user={obj.user}
                        createdAt={obj.createdAt}
                        viewsCount={obj.viewsCount}
                        tags={obj.tags}
                        isEditable={userData?._id === obj.user?._id}
                    />
                )).reverse()}
            </Grid>
            <Grid xs={4} item>
                <SearchBlock/>
                <TagsBlock items={tagsItems} isLoading={isTagsLoading} searchRequestCallBack={() => {
                }}/>
                <CommentsBlock
                    items={lastComments}
                    users={users}
                    isLoading={false}
                    title={'Последнии комментарии'}
                />
            </Grid>
        </Grid>
    </>
}