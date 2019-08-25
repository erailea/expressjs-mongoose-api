const express = require('express')
const router = express.Router()

// Models
const Movie = require('../models/Movie')

/* GET movies listing. */
router.get('/', async(req, res, next) => {
    try {
        const allMovies = await Movie.aggregate([{
                $lookup: {
                    from: 'directors',
                    localField: 'director',
                    foreignField: '_id',
                    as: 'director'
                }
            },
            {
                $unwind: '$director'
            }
        ]).exec()

        if (!allMovies) {
            next({ message: 'The movie was not found' })
        }
        res.json(allMovies)

    } catch (err) {
        res.json(err)
    }
})

/* Top 10 list */
router.get('/top10', async(req, res, next) => {
    try {
        const allMovies = await Movie.find({}).limit(10).sort({ imdb_score: -1 }).exec()

        if (!allMovies) {
            next({ message: 'The movie was not found' })
        }
        res.json(allMovies)

    } catch (err) {
        res.json(err)
    }
})

/* GET a movie. */
router.get('/:movie_id', async(req, res, next) => {
    try {
        const aMovie = await Movie.findById(req.params.movie_id).exec()
        if (!aMovie) {
            next({ message: 'The movie was not found' })
        }
        res.json(aMovie)
    } catch (err) {
        res.json(err)
    }
})

/* POST movie. */
router.post('/', async(req, res, next) => {
    try {
        const newMovie = await new Movie(req.body).save({ new: true })
        res.json({ newMovie, status: 201 })
    } catch (err) {
        res.json(err)
    }

})

/* UPDATE a movie */
router.put('/:movie_id', async(req, res, next) => {
    try {
        const movieUpdate = await Movie.findByIdAndUpdate(req.params.movie_id, req.body, { new: true, runValidators: true })
        if (!movieUpdate) {
            next({ message: 'The movie was not found.', code: 99 })
        }
        res.json(movieUpdate)
    } catch (err) {
        res.json(err)
    }
})

/* DELETE a movie */
router.delete('/:movie_id', async(req, res, next) => {
    try {
        const deletedMovie = await Movie.findByIdAndRemove(req.params.movie_id).exec()
        if (!deletedMovie) {
            next({ message: 'The movie was not found.', code: 99 })
        }
        res.json({ deletedMovie, status: 1 })
    } catch (err) {
        res.json(err)
    }
})

/* Movies between two dates */
router.get('/between/:start_year/:end_year', async(req, res, next) => {
    const { start_year, end_year } = req.params;

    try {
        const allMovies = await Movie.find({
            year: { '$gte': parseInt(start_year), '$lte': parseInt(end_year) }
        }).exec()

        if (!allMovies) {
            next({ message: 'The movie was not found' })
        }
        res.json(allMovies)

    } catch (err) {
        res.json(err)
    }
})


module.exports = router