import {useDispatch, useSelector} from "react-redux";
import {Grid} from "@mui/material";
import {Post} from "../components/Post/Post";
import {TagsBlock} from "../components/TagsBlock/TagsBlock";

import {fetchPosts, fetchTags} from "../redux/slices/posts";
import {useEffect} from "react";

export const SearchPage = () => {
    const dispatch = useDispatch()
    const {posts, tags} = useSelector(state => state.posts)
    const userData = useSelector(state => state.auth.data)
    const isPostsLoading = posts.status === 'loading'
    const isTagsLoading = tags.status === 'loading'
    const pathname = window.location.pathname
    let tag = pathname.slice(5, pathname.length)
    console.log(tag)
    const postItems = posts.items
    let filteredPosts = postItems.filter(post => post.tags.find(t => t === tag))
    console.log(filteredPosts)
    useEffect(() => {
        dispatch(fetchPosts())
        dispatch(fetchTags())
    }, [])

    return <>
        Страница поиска
        <Grid container spacing={4}>
            <Grid xs={8} item>
                {(isPostsLoading && filteredPosts ? [...Array(5)] : filteredPosts).map((obj, index) => isPostsLoading ? (
                    <Post key={index} isLoading={true}/>
                ) : (
                    <Post
                        _id={obj._id}
                        title={obj.title}
                        imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
                        user={obj.user}
                        createdAt={obj.createdAt}
                        viewsCount={obj.viewsCount}
                        commentsCount={3}
                        tags={obj.tags}
                        isEditable={userData?._id === obj.user?._id}
                    />
                )).reverse()}
            </Grid>
            {/*<Grid xs={4} item>*/}
            {/*    <TagsBlock items={tags.items} isLoading={isTagsLoading} />*/}

            {/*</Grid>*/}
        </Grid>
    </>
}