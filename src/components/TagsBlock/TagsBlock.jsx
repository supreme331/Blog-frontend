import {List, ListItem, ListItemButton, ListItemText, Skeleton} from "@mui/material"
import {Link} from "react-router-dom"
import {SideBlock} from "../SideBlock/SideBlock"
import styles from "../TagsBlock/Tags.module.scss"

export const TagsBlock = ({items, isLoading = true, searchRequestCallBack}) => {
    return <SideBlock title="Тэги">
        <List className={styles.tagsBlock}>
            {(isLoading ? [...Array(5)] : items).map((name, index) => {
                return (
                    <Link key={index} onClick={() => {
                        searchRequestCallBack(name)
                    }} to={`/tag/${name}`}>
                        <ListItem disablePadding>
                            <ListItemButton>
                                {isLoading ? (
                                    <Skeleton width={100}/>
                                ) : (
                                    <ListItemText primary={`#${name}`}/>
                                )}
                            </ListItemButton>
                        </ListItem>
                    </Link>
                )
            })}
        </List>
    </SideBlock>
}