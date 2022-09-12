import {useSelector} from "react-redux"
import {Accordion, AccordionDetails, AccordionSummary, Box, Divider, Grid, Typography} from "@mui/material"
import {Post} from "../../components/Post/Post"
import {TagsBlock} from "../../components/TagsBlock/TagsBlock"
import React, {useEffect, useState} from "react"
import * as queryString from "query-string"
import {SearchBlock} from "../../components/SearchBlock/SearchBlock"
import {Link} from "react-router-dom"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import {Preloader} from "../../components/Preloader/Preloader"
import styles from "./SearchPage.module.scss"

export const SearchPageContainer = React.memo(() => {

    const isMobile = useSelector(state => state.auth.isMobile)
    let pathname = window.location.pathname
    const {posts, tags} = useSelector(state => state.posts)
    const tagsItems = Array.from(new Set(tags.items))
    const [tag, setTag] = useState('')
    const [filteredPosts, setFilteredPosts] = useState()
    const postItems = posts.items
    const queryParams = queryString.parseUrl(window.location.href)
    let url = queryParams.url
    let querySearchText = queryParams.query.searchText
    let querySearchIn = queryParams.query.searchIn
    const [searchRequest, setSearchRequest] = useState('')

    useEffect(() => {
        if (postItems.length > 0 && pathname.includes("tag")) {
            let tag = pathname.slice(5, pathname.length)
            setTag(tag)
            setFilteredPosts(postItems.filter(post => post.tags.find(t => t === tag)))
        }
        if (postItems.length > 0 && pathname.includes("search")) {
            let searchRequest = querySearchText.toLowerCase()
            if (querySearchIn === "title") {
                setFilteredPosts(postItems
                    .filter(post => post.title.toLowerCase()
                        .includes(searchRequest)))
            }
            if (querySearchIn === "text") {
                setFilteredPosts(postItems
                    .filter(post => post.text.toLowerCase()
                        .includes(searchRequest)))
            }
            setSearchRequest(searchRequest)
        }
    }, [postItems, tag, pathname, url, querySearchText, querySearchIn])

    const userData = useSelector(state => state.auth.data)
    const isPostsLoading = posts.status === 'loading'
    const isTagsLoading = tags.status === 'loading'

    const searchRequestCallBack = (tag = '') => {
        setTag(tag)
    }

    return filteredPosts ? (<SearchPage
        isMobile={isMobile}
        tag={tag}
        tagsItems={tagsItems}
        filteredPosts={filteredPosts}
        userData={userData}
        isPostsLoading={isPostsLoading}
        isTagsLoading={isTagsLoading}
        searchRequestCallBack={searchRequestCallBack}
        searchRequest={searchRequest}
    />) : <Preloader/>
})

const SearchPage = ({
                        isMobile,
                        tag,
                        tagsItems,
                        filteredPosts,
                        userData,
                        isPostsLoading,
                        isTagsLoading,
                        searchRequestCallBack,
                        searchRequest
                    }) => {
    return isMobile ? <>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>Найти статью</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <SearchBlock isMobile={isMobile}/>
            </AccordionDetails>
        </Accordion>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>Тэги</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <TagsBlock
                    isMobile={isMobile}
                    items={tagsItems}
                    isLoading={isTagsLoading}
                    searchRequestCallBack={searchRequestCallBack}/>
            </AccordionDetails>
        </Accordion>
        <Box className={styles.title}>
            <Typography variant="h6" gutterBottom component="div">
                Результаты поиска {tag.length > 0 ? `"#${tag}"` : `"${searchRequest}"`}
            </Typography>
        </Box>
        {filteredPosts && filteredPosts.length === 0
            ? <p>Ничего не найдено...</p>
            : filteredPosts.map((obj, index) => isPostsLoading ? (
                <Post key={index} isLoading={true}/>
            ) : (
                <Link key={index} to={`/posts/${obj._id}`}>
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
                        searchRequestCallBack={searchRequestCallBack}
                    />
                </Link>
            )).reverse()}
    </> : <>
        <Box className={styles.title}>
            <Typography variant="h6" gutterBottom component="div">
                Результаты поиска {tag.length > 0 ? `"#${tag}"` : `"${searchRequest}"`}
            </Typography>
        </Box>
        <Grid container spacing={4}>
            <Grid xs={8} item>
                {filteredPosts && filteredPosts.length === 0
                    ? <p>Ничего не найдено...</p>
                    : filteredPosts.map((obj, index) => isPostsLoading ? (
                        <Post key={index} isLoading={true}/>
                    ) : (
                        <Link key={index} to={`/posts/${obj._id}`}>
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
                                searchRequestCallBack={searchRequestCallBack}
                            />
                        </Link>
                    )).reverse()}
            </Grid>
            <Grid xs={4} item>
                <Box className={styles.sideBlock}>
                    <SearchBlock/>
                    <TagsBlock items={tagsItems}
                               isLoading={isTagsLoading}
                               searchRequestCallBack={searchRequestCallBack}/>
                </Box>
            </Grid>
        </Grid>
    </>
}