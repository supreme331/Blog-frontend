import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {SideBlock} from "../SideBlock/SideBlock"
import {useForm} from "react-hook-form";
import * as queryString from "query-string"
import styles from "./SearchBlock.module.scss"

export const SearchBlock = () => {
    const {register, handleSubmit, formState: {errors, isValid}} = useForm({
        defaultValues: {
            searchText: '',
            searchIn: 'title'
        },
        mode: "all"
    })


    const onSubmit = async (values) => {
        console.log(values)
        let url = queryString.stringifyUrl({
            url: 'http://localhost:3000/search',
            query: {searchText: values.searchText, searchIn: values.searchIn}
        })
        window.location.href = url

        if (values.searchIn === 'title') {

        }
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
            <Button type="submit" variant="outlined" size="small">Найти</Button>
        </form>
    </SideBlock>
}