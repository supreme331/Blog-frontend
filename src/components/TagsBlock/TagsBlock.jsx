import {List, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton} from "@mui/material"
import TagIcon from "@mui/icons-material/Tag"
import {Link} from "react-router-dom"
import {SideBlock} from "../SideBlock/SideBlock"
import styles from "../TagsBlock/Tags.module.scss";

export const TagsBlock = ({items, isLoading = true}) => {
    return <SideBlock title="Тэги">
        <List className={styles.tagsBlock}>
            {(isLoading ? [...Array(5)] : items).map((name, index) => (
                <Link to={`/tag/${name}`}>
                    <ListItem key={index} disablePadding>
                        <ListItemButton>
                            {/*<ListItemIcon>*/}
                            {/*    <TagIcon />*/}
                            {/*</ListItemIcon>*/}
                            {isLoading ? (
                                <Skeleton width={100} />
                            ) : (
                                <ListItemText primary={`#${name}`} />
                            )}
                        </ListItemButton>

                    </ListItem>
                </Link>
            ))}
        </List>
    </SideBlock>
}