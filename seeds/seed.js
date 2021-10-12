const faker = require("faker");
const mongoose = require("mongoose");
const { User, Thought } = require("../models");

// create friends
const createFriendData = async (userData) => {
  let friendUserData = [];
  for (let i = 0; i < 50; i += 1) {
    const userId = userData[i]._id;
    const randomUserIndex = Math.floor(Math.random() * userData.length);
    const friendUserId = userData[randomUserIndex]._id;

    if (userId !== friendUserId) {
      friendUserData.push({ friendUserId, userId });
      const friendResult = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { friends: friendUserId } },
        { new: true, runValidators: true }
      );
    }
  }
  return friendUserData;
};

// create thought data
const createThoughtData = async (userData) => {
  const thoughtData = [];
  for (let i = 0; i < 50; i += 1) {
    const thoughtText = faker.lorem.word(5);
    const randomUserIndex = Math.floor(Math.random() * userData.length);
    const userId = userData[randomUserIndex]._id;
    const username = userData[randomUserIndex].username;
    const _id = mongoose.Types.ObjectId();

    thoughtData.push({ _id, thoughtText, username });

    const thoughtFriendResult = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { thoughts: { _id, thoughtText, username } } },
      { new: true, runValidators: true }
    );
  }

  if (thoughtData) {
    const thoughtResult = await Thought.collection.insertMany(thoughtData);
    return thoughtData;
  }
};

// create reactions
const createReactionData = async (userData, thoughtData) => {
  const reactionData = [];
  for (let i = 0; i < 100; i += 1) {
    const reactionBody = faker.lorem.sentence();

    const randomUserIndex = Math.floor(Math.random() * userData.length);
    const username = userData[randomUserIndex].username;

    const randomThoughtIndex = Math.floor(Math.random() * thoughtData.length);
    const thoughtId = thoughtData[randomThoughtIndex]._id;
    const _id = mongoose.Types.ObjectId();

    reactionData.push({ _id, reactionBody, username });

    const reactionResult = await Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $addToSet: { reactions: { _id, reactionBody, username } } },
      { new: true, runValidators: true }
    );
  }
  if (reactionData) {
    return reactionData;
  }
};

const createSeeds = async () => {
  mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost/social-network",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  await User.deleteMany({});
  await Thought.deleteMany({});

  const numUsers = 50;
  const userData = [];

  // create user data
  for (let i = 0; i < numUsers; i += 1) {
    const username = faker.internet.userName();
    const email = faker.internet.email(username);
    const _id = mongoose.Types.ObjectId();

    userData.push({ _id, username, email });
  }

  const createdUsers = await User.collection.insertMany(userData);

  if (userData.length === 50) {
    const friendData = await createFriendData(userData);
    if (friendData) {
      const thoughtData = await createThoughtData(userData);
      if (thoughtData) {
        const reactionData = await createReactionData(userData, thoughtData);
        if (reactionData) {
          console.log("success");
        }
      }
    }
  }

  console.log("all done!");
  process.exit(0);
};

createSeeds();
