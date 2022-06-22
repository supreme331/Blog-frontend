import React from "react"
import {SideBlock} from "./SideBlock/SideBlock"
import {Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Skeleton} from "@mui/material"


export const CommentsBlock = (items, children, isLoading = true) => {
    return <SideBlock title="Комментарии">
        <List>
            {(isLoading ? [...Array(5)] : items).map((obj, index) => (
                <React.Fragment key={index}>
                    <ListItem alingItems="flex-start">
                        <ListItemAvatar>
                            {isLoading ? (
                                <Skeleton variant="circular" width={40} height={40}/>
                            ) : (
                                <Avatar alt={obj.user.fullName} src={obj.user.avatarUrl}/>
                            )}
                        </ListItemAvatar>
                        {isLoading ? (
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <Skeleton variant="text" width={120} height={25}/>
                                <Skeleton variant="text" width={230} height={18}/>
                            </div>
                        ) : (
                            <ListItemText primary={obj.user.fullName} secondary={obj.text}/>
                        )}
                    </ListItem>
                    <Divider variant="inset" component="li"/>
                </React.Fragment>
            ))}
        </List>
    </SideBlock>
}