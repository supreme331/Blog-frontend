import {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {Button, Paper, TextField} from "@mui/material"
import styles from './AddPost.module.scss'
import SimpleMDE from 'react-simplemde-editor'
import {Link, Navigate, useNavigate, useParams} from "react-router-dom"
import {useSelector} from "react-redux"
import {selectIsAuth} from "../../redux/slices/auth"
import 'easymde/dist/easymde.min.css'
import axios from '../../axios'

export const AddPost = () => {
    const {id} = useParams()
    const isAuth = useSelector(selectIsAuth)
    const navigate = useNavigate()
    const [text, setText] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState('')
    const inputFileRef = useRef(null)
    const isEditing = Boolean(id)

    const handleChangeFile = async(event) => {
        try {
            const formData = new FormData()
            const file = event.target.files[0]
            formData.append('image', file)
            const {data} = await axios.post('/upload', formData)
            setImageUrl(data.url)
            console.log("handleChangeFile", imageUrl)
        }
        catch (err) {
            console.warn(err)
            alert('Ошибка при загрузке файла')
        }
    }
    const onRemoveImage =  () => {
        setImageUrl('')
        console.log("onRemoveImage", imageUrl)
    }
    const onChange = useCallback((value) => {
        setText(value)
    }, [])

    const onSubmit = async () => {
        try {
            setIsLoading(true)
            const fields = {
                title,
                imageUrl,
                tags,
                text
            }
            console.log(imageUrl)
            const {data} = isEditing
                ? await axios.patch(`/posts/${id}`, fields)
                : await axios.post('/posts', fields)
            const _id = isEditing ? id : data._id
            navigate(`/posts/${_id}`)
        }
        catch (err) {
            console.warn(err)
            alert('Ошибка при создании статьи!')
        }
    }

    useEffect(() => {
        if (id) {
            axios.get(`/posts/${id}`).then(({data}) => {
                setTitle(data.title)
                setText(data.text)
                setImageUrl(data.imageUrl)
                setTags(data.tags.join(','))
            }).catch(err => {
                console.warn(err)
                alert('Ошибка при получении статьи!')
            })
        }
    }, [])

    const options = useMemo(() => ({
        spellChecker: false,
        maxHeight: '400px',
        autofocus: true,
        placeholder: 'Введите текст...',
        status: false,
        autosave: {
            enabled: true,
            delay: 1000
        }
    }), [])

    if (!window.localStorage.getItem('token') && !isAuth) {
        return <Navigate to='/'/>
    }

    return <Paper className={styles.root}>
        {imageUrl && (
            <div className={styles.previewBlock}>
                <img className={styles.image} src={`${process.env.REACT_APP_API_URL}${imageUrl}`} alt="Uploaded"/>
                <Button variant="contained" color="error" onClick={onRemoveImage}>
                    Удалить превью
                </Button>
            </div>
        )}
        <div className={styles.previewBlock}>
            <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
                Загрузить превью
            </Button>
            <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden/>
        </div>

        <TextField
            classes={{ root: styles.title }}
            variant="standard"
            placeholder="Заголовок статьи..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
        />
        <TextField
            classes={{ root: styles.tags }}
            variant="standard"
            placeholder="Тэги"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            fullWidth />
        <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options}/>
        <div className={styles.buttons}>
            <Button onClick={onSubmit} size="large" variant="contained">
                {isEditing ? 'Сохранить' : 'Опубликовать'}
            </Button>
            {/*<Link to="/">*/}
                <Button size="large" href={"/"} variant="outlined">
                    Отмена
                </Button>
            {/*</Link>*/}
        </div>
    </Paper>
}