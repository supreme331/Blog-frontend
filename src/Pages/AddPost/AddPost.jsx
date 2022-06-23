import {useCallback, useMemo, useRef, useState} from "react"
import {Button, Paper, TextField} from "@mui/material"
import styles from './AddPost.module.scss'
import SimpleMDE from 'react-simplemde-editor'
import {Link, Navigate, useNavigate} from "react-router-dom"
import {useSelector} from "react-redux"
import {selectIsAuth} from "../../redux/slices/auth"
import 'easymde/dist/easymde.min.css'
import axios from '../../axios'

export const AddPost = () => {
    const isAuth = useSelector(selectIsAuth)
    const navigate = useNavigate()
    const [text, setText] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState('')
    const inputFileRef = useRef(null)

    const handleChangeFile = async(event) => {
        try {
            const formData = new FormData()
            const file = event.target.files[0]
            formData.append('image', file)
            const {data} = await axios.post('/upload', formData)
            setImageUrl(data.url)
        }
        catch (err) {
            console.warn(err)
            alert('Ошибка при загрузке файла')
        }
    }
    const onRemoveImage =  () => {
        setImageUrl('')
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
                tags: tags.split(','),
                text
            }
            console.log(tags.split(','))
            const {data} = await axios.post('/posts', fields)
            const id = data._id
            navigate(`/posts/${id}`)
        }
        catch (err) {
            console.warn(err)
            alert('Ошибка при создании статьи!')
        }
    }

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

    return <Paper style={{ padding: 30 }}>
        <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
            Загрузить превью
        </Button>
        <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden/>
        {imageUrl && (
            <>
                <Button variant="contained" color="error" onClick={onRemoveImage}>
                    Удалить
                </Button>
                <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded"/>
            </>
        )}
        <br/>
        <br/>
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
                Опубликовать
            </Button>
            <Link to="/">
                <Button size="large">
                    Отмена
                </Button>
            </Link>
        </div>
    </Paper>
}