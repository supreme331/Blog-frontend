import {useDispatch, useSelector} from "react-redux"
import {CircularProgress, Divider, Grid, Typography} from "@mui/material"
import {Post} from "../components/Post/Post"
import {TagsBlock} from "../components/TagsBlock/TagsBlock"
import {fetchPosts, fetchTags} from "../redux/slices/posts"
import {useEffect, useState} from "react"
import * as queryString from "query-string"
import {SearchBlock} from "../components/SearchBlock/SearchBlock"

export const SearchPageContainer = () => {

    const dispatch = useDispatch()
    const pathname = window.location.pathname
    const {posts, tags} = useSelector(state => state.posts)
    const tagsItems = Array.from(new Set(tags.items))
    const [tag, setTag] = useState('')
    const [filteredPosts, setFilteredPosts] = useState()
    const postItems = posts.items
    const queryParams = queryString.parseUrl(window.location.href)
    const [searchRequest, setSearchRequest] = useState('')

    useEffect(() => {
        dispatch(fetchPosts())
        dispatch(fetchTags())
    }, [])

    useEffect(() => {
        if (postItems.length > 0 && pathname.includes("tag")) {
            let tag = pathname.slice(5, pathname.length)
            setTag(tag)
            setFilteredPosts(postItems.filter(post => post.tags.find(t => t === tag)))
        }
        if (postItems.length > 0 && pathname.includes("search")) {
            let searchRequest = queryParams.query.searchText.toLowerCase()
            if (queryParams.query.searchIn === "title") {
                setFilteredPosts(postItems
                    .filter(post => post.title.toLowerCase()
                        .includes(searchRequest)))
            }
            if (queryParams.query.searchIn === "text") {
                setFilteredPosts(postItems
                    .filter(post => post.text.toLowerCase()
                        .includes(searchRequest)))
            }
            setSearchRequest(searchRequest)
        }
    }, [postItems, tag, pathname, queryParams])

    const userData = useSelector(state => state.auth.data)
    const isPostsLoading = posts.status === 'loading'
    const isTagsLoading = tags.status === 'loading'

    const searchRequestCallBack = (tag = '') => {
        setTag(tag)
    }

    return filteredPosts ? (<SearchPage
        tag={tag}
        tagsItems={tagsItems}
        filteredPosts={filteredPosts}
        userData={userData}
        isPostsLoading={isPostsLoading}
        isTagsLoading={isTagsLoading}
        searchRequestCallBack={searchRequestCallBack}
        searchRequest={searchRequest}
    />) : <CircularProgress />
}

const SearchPage = ({
                        tag,
                        tagsItems,
                        filteredPosts,
                        userData,
                        isPostsLoading,
                        isTagsLoading,
                        searchRequestCallBack,
                        searchRequest
                    }) => {
    return <>
        <Typography variant="h6" gutterBottom component="div">
            Результаты поиска {tag.length > 0 ? `"#${tag}"` : `"${searchRequest}"`}
        </Typography>
        <Grid container spacing={4}>
            <Grid xs={8} item>
                {filteredPosts && (isPostsLoading ? [...Array(5)] : filteredPosts)
                    .map((obj, index) => isPostsLoading ? (
                        <Post key={index} isLoading={true}/>
                    ) : (
                        <Post
                            _id={obj._id}
                            title={obj.title}
                            // imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL || "http://localhost:4444"}${obj.imageUrl}` : ''}
                            imageUrl={obj.imageUrl ? obj.imageUrl : ''}
                            user={obj.user}
                            createdAt={obj.createdAt}
                            viewsCount={obj.viewsCount}
                            commentsCount={3}
                            tags={obj.tags}
                            isEditable={userData?._id === obj.user?._id}
                        />
                    )).reverse()}
            </Grid>
            <Grid xs={4} item>
                <SearchBlock/>
                <Divider />
                <TagsBlock items={tagsItems}
                           isLoading={isTagsLoading}
                           searchRequestCallBack={searchRequestCallBack}/>
            </Grid>
        </Grid>
    </>
}