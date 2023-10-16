import express from 'express'
import mongoose from 'mongoose'
import { registerValidation, loginValidation, articleCreateValidation } from './validations.js'
import checkAuth from './utils/checkAuth.js'

import * as userControllers from './controllers/userController.js'
import * as articleControllers from './controllers/articleController.js'

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

// подключаем чтение формата json
app.use(express.json())


app.post('/auth/login', userControllers.login)
app.post('/auth/register', registerValidation, userControllers.register)
app.get('/auth/me', checkAuth, userControllers.getMe)
app.get('/', userControllers.getAll)

app.get('/articles', articleControllers.getAll)
app.get('/articles/:id', articleControllers.getOne)
app.post('/articles', checkAuth, articleCreateValidation, articleControllers.create)
// запускаем сервер на порту 8888
app.listen(8888, (err) => {
    if (err) {
        return console.log(err)
    } else console.log("Server OK")
})

