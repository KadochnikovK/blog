import { body } from "express-validator";

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Короткий пароль').isLength({ min: 5 }),
    body('fullName', 'Короткое имя').isLength({min: 3}),
    body('avatarUrl', 'Неверная ссылка на аватар').optional().isURL(),
]

