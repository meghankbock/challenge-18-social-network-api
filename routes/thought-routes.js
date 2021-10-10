const router = require("express").Router();
const {
    getAllThoughts,
    getThoughtById,
    addThought,
    updateThought,
    removeThought,
    addReaction,
    removeReaction
} = require("../controllers/thought-controller");

// GET ALL and POST at /api/thoughts
router.route("/").get(getAllThoughts).post(addThought);

// GET ONE, PUT, and DELETE at /api/thoughts/:thoughtId
router.route('/:thoughtId').get(getThoughtById).put(updateThought).delete(removeThought);

// POST and DELETE at /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').put(addReaction).delete(removeReaction);

module.exports = router;
