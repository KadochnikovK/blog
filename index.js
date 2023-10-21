import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'

import { registerValidation, loginValidation, articleCreateValidation } from './validations.js'
import {handleValidationErrors,checkAuth} from './utils/index.js'
import { UserControllers, ArticleControllers } from './controllers/index.js'

mongoose.connect('mongodb://127.0.0.1:27017/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Соединение с mongoDB успешно установлено')
}).catch((err) => {
    console.error(`Ошибка подключения к mongoDB: ${err}`)
})

// создаем приложение express
const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => { 
        cb(null, file.originalname)
    },
})

const upload = multer({ storage })

// подключаем чтение формата json
app.use(express.json())
app.use('/uploads', express.static('uploads'))


app.post('/auth/login', loginValidation, handleValidationErrors, UserControllers.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserControllers.register)
app.get('/auth/me', checkAuth, UserControllers.getMe)
app.get('/', UserControllers.getAll)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/articles', ArticleControllers.getAll)
app.get('/articles/:id', ArticleControllers.getOne)
app.post('/articles', checkAuth, articleCreateValidation, handleValidationErrors, ArticleControllers.create)
app.delete('/articles/:id', checkAuth, ArticleControllers.remove)
app.patch('/articles/:id', checkAuth, articleCreateValidation, handleValidationErrors, ArticleControllers.update)

// запускаем сервер на порту 8888
app.listen(8888, (err) => {
    if (err) {
        return console.log(err)
    } else console.log("Server OK")
})

