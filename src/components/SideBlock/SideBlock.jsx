import {Paper, Typography} from "@mui/material"
import styles from "./SideBlock.module.scss"

export const SideBlock = ({title, isMobile, children}) => {
    return <Paper classes={{root: styles.root}}>
        {!isMobile && <Typography variant="h6" classes={{root: styles.title}}>
            {title}
        </Typography>}
        {children}
    </Paper>
}