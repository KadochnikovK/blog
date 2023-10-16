import UserModel from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'


export { register, login, getMe }

const register = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })

        const user = await doc.save()
   
        const token = jwt.sign({
            _id: user._id,
        }, 'secretKey', {
            expiresIn: '30d',
        })
        console.log(token)
        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            err: err,
            message: 'Не удалось зарегистрироваться'
        })
    }

}

const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({
            email: req.body.email,
        })
        if (!user) {
            return res.status(404).json({
                message: 'Неверный логин или пароль'
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if (!isValidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль',
            })
        }

        const token = jwt.sign({
            _id: user._id
        }, 'secretKey', {
            expiresIn: '30d',
        })

        const { passworHash, ...userData } = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        })
    }
}

const getMe = async (req, res) => {
    try {

        const user = await UserModel.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            })
        }


        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData
        })

    }
    catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Нет доступа'
        })
    }
}


export const getAll = async (req, res) => {
    try {
        const users = await UserModel.find()
        if(!users) {
            return res.status(404).json({
                message: "Пользователи не найдены"
            })
        }
        res.json({
            ...users
        })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Не удалось подключиться'
        })
    }
}