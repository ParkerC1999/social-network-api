const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtById,
    addThought,
    updateThought,
    removeThought,
    addReaction,
    removeReaction
} = require('../controllers/thought-controller');

// /api/thoughts
router
    .route('/')
    .get(getAllThoughts)

// /api/thought/:id
router
    .route('/:id')
    .get(getThoughtById)

// /api/thoughts/<userId>
router
    .route('/:userId')
    .post(addThought)
    .delete(removeThought)
    .put(updateThought)

// /api/thoughts/<userId>/<thoughtId>
router
    .route('/:userId/:reactionId')
    .put(addReaction)
    .delete(removeReaction)

module.exports = router;