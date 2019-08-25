const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Models
const Director = require('../models/Director')

/**
 * Get all directors
 */
router.get('/', async (req, res, next) => {
  try {
    const directors = await Director.aggregate([
      { 
        $lookup: {
          from: 'movies',
          localField: '_id',
          foreignField: 'director_id',
          as: 'movies'
        }
      },
      {
        $unwind: {
          path: '$movies',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: {
            _id: '$_id',
            name: '$name',
            surname: '$surname',
            bio: '$bio'
          },
          movies: {
            $push: '$movies'
          }
        }
      },
      {
        $project: {
          _id: '$_id._id',
          name: '$_id.name',
          surname: '$_id.surname',
          bio: '$_id.bio',
          movies: '$movies'
        }
      }
    ]).exec()

    if (!directors) {
      next({ message: 'Directors was not found.' })
    }

    res.json(directors)

  } catch (error) {
    res.json(err)
  }
})

/**
 * Get a director
 */
router.get('/:director_id', async (req, res, next) => {
  try {
    const oneDirector = await Director.aggregate([
      {
        $match: {
          '_id': mongoose.Types.ObjectId(req.params.director_id)
        },
      },
      {
        $lookup: {
          from: 'movies',
          localField: '_id',
          foreignField: 'director_id',
          as: 'movies'
        }
      },
      {
        $unwind: {
          path: '$movies',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: {
            _id: '$_id',
            name: '$name',
            surname: '$surname',
            bio: '$bio'
          },
          movies: {
            $push: '$movies'
          }
        }
      },
      {
        $project: {
          _id: '$_id._id',
          name: '$_id.name',
          surname: '$_id.surname',
          bio: '$_id.bio',
          movies: '$movies'
        }
      }
    ]).exec()

    if (!oneDirector) {
      next({ message: 'Director was not found.' })
    }
    res.json(oneDirector)
  } catch (error) {
    res.json(error)
  }
})

/**
 * Add a director
 */
router.post('/', async (req, res, next) => {
  try {
    const addedDirector = await new Director(req.body).save()
    res.json(addedDirector)
  } catch (error) {
    res.json(error)
  }
})

/**
 * Update a director
 */
router.put('/:director_id', async (req, res, next) => {
  try {
    const updatedDirector = await Director.findByIdAndUpdate(req.params.director_id, req.body, { new: true, runValidators: true })
    if (!updatedDirector) {
      next({ message: 'Director was not found.', code: 99 })
    }
    res.json(updatedDirector)
  } catch (err) {
    res.json(err)
  }
})

/**
 * Delete a director
 */
router.delete('/:director_id', async (req, res, next) => {
  try {
    const deletedDirector = await Director.findByIdAndRemove(req.params.director_id).exec()
    if (!deletedDirector) {
      next({ message: 'Director was not found.', code: 99 })
    }
    res.json({ deletedDirector, status: 1 })
  } catch (err) {
    res.json(err)
  }
})

module.exports = router;
