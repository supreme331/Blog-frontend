import {Accordion, AccordionDetails, AccordionSummary, Box, Grid, Tab, Tabs, Typography} from "@mui/material"
import {Post} from "../../components/Post/Post"
import {TagsBlock} from "../../components/TagsBlock/TagsBlock"
import {CommentsBlock} from "../../components/CommentsBlock/CommentsBlock"
import {useState} from "react"
import {useSelector} from "react-redux"
import {SearchBlock} from "../../components/SearchBlock/SearchBlock"
import styles from "./Home.module.scss"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {Preloader} from "../../components/Preloader/Preloader"

export const Home = ({isInit}) => {

    const users = useSelector(state => state.users.items)
    const userData = useSelector(state => state.auth.data)
    const isMobile = useSelector(state => state.auth.isMobile)
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

    return isInit ? (
        isMobile ? <>
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
                        searchRequestCallBack={() => {
                        }}/>
                </AccordionDetails>
            </Accordion>
            <Tabs
                orientation="horizontal"
                style={{marginBottom: "15px"}}
                value={tabsValue}
                aria-label="basic tabs example">
                <Tab onClick={() => {
                    onSetTabsValue(0)
                }} label="Новые"/>
                <Tab onClick={() => {
                    onSetTabsValue(1)
                }} label="Популярные"/>
            </Tabs>
            {(isPostsLoading
                ? [...Array(5)]
                : tabsValue === 0
                    ? posts.items
                    : popularPostItems).map((obj, index) => isPostsLoading ? (
                <Post key={index} isLoading={true}/>
            ) : (
                <Post
                    key={index}
                    _id={obj._id}
                    title={obj.title}
                    // imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL || "http://localhost:4444"}${obj.imageUrl}` : ''}
                    imageUrl={obj.imageUrl ? obj.imageUrl : ''}
                    user={obj.user}
                    createdAt={(new Date(obj.createdAt)).toUTCString()}
                    viewsCount={obj.viewsCount}
                    tags={obj.tags}
                    isEditable={userData?._id === obj.user?._id}
                />
            )).reverse()}
        </> : <>
            <Grid container spacing={6}>
                <Grid xs={8} item>
                    <Tabs
                        orientation="horizontal"
                        style={{marginBottom: "15px"}}
                        value={tabsValue}
                        aria-label="basic tabs example">
                        <Tab onClick={() => {
                            onSetTabsValue(0)
                        }} label="Новые"/>
                        <Tab onClick={() => {
                            onSetTabsValue(1)
                        }} label="Популярные"/>
                    </Tabs>
                    {(isPostsLoading
                        ? [...Array(5)]
                        : tabsValue === 0
                            ? posts.items
                            : popularPostItems).map((obj, index) => isPostsLoading ? (
                        <Post key={index} isLoading={true}/>
                    ) : (
                        <Post
                            key={index}
                            _id={obj._id}
                            title={obj.title}
                            // imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL || "http://localhost:4444"}${obj.imageUrl}` : ''}
                            imageUrl={obj.imageUrl ? obj.imageUrl : ''}
                            user={obj.user}
                            createdAt={(new Date(obj.createdAt)).toUTCString()}
                            viewsCount={obj.viewsCount}
                            tags={obj.tags}
                            isEditable={userData?._id === obj.user?._id}
                        />
                    )).reverse()}
                </Grid>
                <Grid xs={4} item>
                    <Box className={styles.sideBlock}>
                        <SearchBlock/>
                        <TagsBlock
                            items={tagsItems}
                            isLoading={isTagsLoading}
                            searchRequestCallBack={() => {
                            }}/>
                        <CommentsBlock
                            items={lastComments}
                            users={users}
                            isLoading={false}
                            title={'Последнии комментарии'}
                            fromHome={true}
                        />
                    </Box>
                </Grid>
            </Grid>
        </>
    ) : <Preloader/>
}