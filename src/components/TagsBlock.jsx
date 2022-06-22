import {List, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton} from "@mui/material"
import TagIcon from "@mui/icons-material/Tag"
import {Link} from "react-router-dom"
import {SideBlock} from "./SideBlock/SideBlock"

export const TagsBlock = ({items, isLoading = true}) => {
    return <SideBlock title="Тэги">
        <List>
            {(isLoading ? [...Array(5)] : items).map((name, i) => (
                <Link to={`/tags/${name}`}>
                    <ListItem key={i} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <TagIcon />
                            </ListItemIcon>
                            {isLoading ? (
                                <Skeleton width={100} />
                            ) : (
                                <ListItemText primary={name} />
                            )}
                        </ListItemButton>
                    </ListItem>
                </Link>
            ))}
        </List>
    </SideBlock>
}