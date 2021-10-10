const faker = require("faker");

const db = require("./connection");
const { User, Thought } = require("../models");

db.once("open", async () => {
  console.log("seed start");
  await User.deleteMany({});
  await Thought.deleteMany({});

  // create user data
  const userData = [];

  for (let i = 0; i < 50; i += 1) {
    const username = faker.internet.userName();
    const email = faker.internet.email(username);

    userData.push({ username, email });
  }

  const createdUsers = await User.collection.insertMany(userData);

  // create thought data
  let createdThoughts = [];
  const thoughtText = faker.lorem.sentence();

  const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
  const { _id: userId, username } = createdUsers.ops[randomUserIndex];

    const createdThought = await Thought.create({
      thoughtText,
      username
    });
    const updatedUser = await User.updateOne(
      { _id: userId },
      { $push: { thoughts: createdThought._id } }
    );
    createdThoughts.push(createdThought);

  // create reactions
  for (let i = 0; i < 100; i += 1) {
    const reactionBody = faker.lorem.sentence();

    const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
    const { _id: userId, username } = createdUsers.ops[randomUserIndex];

    const randomThoughtIndex = Math.floor(Math.random() * createdThoughts.length);
    const { _id: thoughtId } = createdThoughts[randomThoughtIndex];

    await Thought.updateOne(
      { _id: thoughtId },
      { $push: { replies: { reactionBody: reactionBody, username: username } } },
      { runValidators: true }
    );
  }

  console.log("all done!");
  process.exit(0);
});
