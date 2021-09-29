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

// /thoughts
router
    .route('/')
    .get(getAllThoughts)

// /thought/:id
router
    .route('/:id')
    .get(getThoughtById)
    .delete(removeThought)
    .put(updateThought)

// /thoughts/<userId>
router
    .route('/:userId')
    .post(addThought)

// /thoughts/<userId>/<thoughtId>
router
    .route('/:id/reactions')
    .put(addReaction)
    // .delete(removeReaction)

router
    .route('/:id/reactions/:reactionId')
    .delete(removeReaction)

module.exports = router;