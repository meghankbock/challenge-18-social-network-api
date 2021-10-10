const faker = require("faker");
const mongoose = require('mongoose');
const { User, Thought } = require("../models");

const createSeeds = async () => {

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

  await User.deleteMany({});
  await Thought.deleteMany({});

  const numUsers = 50;

  // create user data
  const userData = [];

  for (let i = 0; i < numUsers; i += 1) {
    const username = faker.internet.userName();
    const email = faker.internet.email(username);
    let { _id } = faker.datatype.hexaDecimal(22);

    userData.push({ _id, username, email });
  }
  console.log("userData: ", userData);

  const createdUsers = await User.collection.insertMany(userData);

  // create friends
  for (let i = 0; i < userData.length; i++) {
    const randomUserIndex = Math.floor(Math.random() * userData.length);
    const userId = userData[randomUserIndex]._id;

    if (userData[i]._id !== userId) {
        await User.findOneAndUpdate(
            { _id: userData[i]._id },
            { $push: { friends: userId } },
            { new: true }
        )
    };

    console.log("userData: ", userData);
  }

  // create thought data
  let createdThoughts = [];
  const thoughtText = faker.lorem.sentence();

  const randomUserIndex = Math.floor(Math.random() * userData.length);
  const userId = userData[randomUserIndex]._id;
  const username = userData[randomUserIndex].username;
  const { _id } = faker.datatype.hexaDecimal(22);

    const createdThought = await Thought.create({
      thoughtText,
      username,
      _id
    });
    const updatedUser = await User.updateOne(
      { _id: userId },
      { $push: { thoughts: createdThought._id } }
    );
    createdThoughts.push(createdThought);

  // create reactions
  for (let i = 0; i < 100; i += 1) {
    const reactionBody = faker.lorem.sentence();

    const randomUserIndex = Math.floor(Math.random() * userData.length);
    const username = userData[randomUserIndex].username;

    const randomThoughtIndex = Math.floor(Math.random() * createdThoughts.length);
    const thoughtId = createdThoughts[randomThoughtIndex]._id;

    await Thought.updateOne(
      { _id: thoughtId },
      { $push: { replies: { reactionBody: reactionBody, username: username } } },
      { runValidators: true }
    );
  }

  console.log("all done!");
  process.exit(0);
};

createSeeds();