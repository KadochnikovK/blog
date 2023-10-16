import { body } from "express-validator";

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Короткий пароль').isLength({ min: 5 }),
    body('fullName', 'Короткое имя').isLength({ min: 3 }),
    body('avatarUrl', 'Неверная ссылка на аватар').optional().isURL(),
]

export const articleCreateValidation = [
    body('title', 'Введите заголовк статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
    body('tags', 'Неверный формат тегов (укажите массив)').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изобрпжение').optional().isString(),
]
