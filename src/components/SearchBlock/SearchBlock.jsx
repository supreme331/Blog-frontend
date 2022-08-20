import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material"
import {SideBlock} from "../SideBlock/SideBlock"
import {useForm} from "react-hook-form"
import * as queryString from "query-string"
import styles from "./SearchBlock.module.scss"

export const SearchBlock = () => {
    const {register, handleSubmit} = useForm({
        defaultValues: {
            searchText: '',
            searchIn: 'title'
        },
        mode: "all"
    })

    const onSubmit = async (values) => {
        window.location.href = queryString.stringifyUrl({
            url: process.env.REACT_APP_API_URL ? 'https://blog-frontend-nine-taupe.vercel.app/search' : 'http://localhost:3000/search',
            query: {searchText: values.searchText, searchIn: values.searchIn}
        })
    }

    return <SideBlock title="Найти статью">
        <form className={styles.searchForm} onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
                <TextField
                    type={"search"}
                    label={"Найти статью"}
                    size="small"
                    variant="standard"
                    {...register('searchText', {required: 'Введите поисковый запрос'})}
                />
            </FormControl>
            <FormControl variant="standard" sx={{minWidth: 120}} size="small">
                <InputLabel id="header-search-form-label">Искать в...</InputLabel>
                <Select
                    labelId={"header-search-form-label"}
                    id={"header-search-form-select"}
                    {...register('searchIn')}
                    defaultValue={'title'}
                >
                    <MenuItem value={'title'}>заголовках</MenuItem>
                    <MenuItem value={'text'}>тексте</MenuItem>
                </Select>
            </FormControl>
            <Button style={{margin: "10px"}} type="submit" variant="outlined" size="small">Найти</Button>
        </form>
    </SideBlock>
}