const router = require("express").Router();
const {} = require("../controllers/user-controller");

// GET ALL and POST at /api/users
router.route("/").get(getAllUsers).post(createUser);

// GET ONE, PUT, and DELETE at /api/users/:id
router.route('/:id').get(getUserById).put(updateUser).delete(User);

module.exports = router;
