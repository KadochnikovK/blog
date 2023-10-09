import express from 'express'

import mongoose from 'mongoose'


import { registerValidation } from './validations/auth.js'


import checkAuth from './utils/checkAuth.js'

import { register, login, getMe } from './controllers/userController.js'



mongoose.connect('mongodb://localhost:27017/blog', {
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

app.post('/auth/login', login)

app.post('/auth/register', registerValidation, register)

app.get('/auth/me', checkAuth, getMe)

// запускаем сервер на порту 8888
app.listen(8888, (err) => {
    if (err) {
        return console.log(err)
    } else console.log("Server OK")
})

