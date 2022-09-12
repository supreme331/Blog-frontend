import {CircularProgress} from "@mui/material"
import styles from "./Preloader.module.scss"

export const Preloader = () => {
    return <div className={styles.spinner}>
        <CircularProgress/>
    </div>
}