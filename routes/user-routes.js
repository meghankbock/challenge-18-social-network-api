const router = require("express").Router();
const {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    removeUser,
    addFriend,
    removeFriend
} = require("../controllers/user-controller");

// GET ALL and POST at /api/users
router.route("/").get(getAllUsers).post(createUser);

// GET ONE, PUT, and DELETE at /api/users/:userId
router.route('/:userId').get(getUserById).put(updateUser).delete(removeUser);

// POST and DELETE at /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;
