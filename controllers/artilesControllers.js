import ArticleModel from '../models/Article.js'

export const getAll = async (req, res) => {
    try {
        const articles = await ArticleModel.find().populate('user').exec()
        if (articles.length === 0) {
            console.error("Статьи не найдены")
            res.status(403).json({
                message: "Статьи не найдены"
            })
        }
        res.status(200).json({
            ...articles
        })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Не удалось получить статьи',
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new ArticleModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,

        })
        const article = await doc.save()

        res.json(article)
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Не удалось создать статью',
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const articleId = req.params.id;
        const filter = { _id: articleId };
        const update = { $inc: { viewsCount: 1 } };
        const doc = await ArticleModel.findOneAndUpdate(
            filter,
            update,
        )

        const article = await ArticleModel.findOne({_id: articleId})
        res.json(article)

        // const article = await ArticleModel.findOne({"_id": articleId})
        
        //     res.json(article)
        
        // ArticleModel.findOneAndUpdate(
            // {
            //     _id: articleId,
            // },
            // {
            //     $inc: { viewsCount: 1 },
            // },
            // {
            //     returnDocument: 'after',
            // },
            // (err, doc) => {
            //     if (err) {
            //         console.error(err)
            //         return res.status(500).json({
            //             message: 'Не удалось вернуть статью',
            //         })
            //     }
            //     if (!doc) {
            //         return res.status(404).json({
            //             message: 'Статья не найдена',
            //         })
            //     }
            //     res.json(doc)
            // }

        // );
    }
    catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Не удалось вернуть статью 2',
        })
    }
}