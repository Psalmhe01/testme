import { Topic } from "../Models/Topic.js";
import { User } from "../Models/User.js";

export const createTopic = async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  const userId = req.session.userId;
  try {
    const { title, description } = req.body;

    const topic = await Topic.create({
      title,
      description,
      createdBy: userId,
      subscribers: [userId], // Auto-subscribe the creator
    });

    // Update the user's subscribedTopics list
    await User.findByIdAndUpdate(userId, {
      $push: { subscribedTopics: topic._id },
    });

    res.redirect("/topics");
  } catch (error) {
    if (error.code === 11000) {
      return res.render("dashboard", {
        error: "Topic already exists. Create new topic.",
      });
    }
    // Re-fetch data to ensure the view has necessary variables on error
    const [topics, user] = await Promise.all([
      Topic.find().populate("createdBy", "username").lean(),
      User.findById(userId).select("subscribedTopics").lean(),
    ]);
    res.render("topics", {
      topics,
      subscribedTopics: user?.subscribedTopics || [],
      userId,
      error: error.message,
    });
  }
};

export const subscribeToTopic = async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).send("Unauthorized");
    const { topicId } = req.params;
    const userId = req.session.userId;

    const topicUpdate = await Topic.findByIdAndUpdate(topicId, {
      $addToSet: { subscribers: userId },
    });
    const userUpdate = await User.findByIdAndUpdate(userId, {
      $addToSet: { subscribedTopics: topicId },
    });

    if (!topicUpdate || !userUpdate)
      return res.status(404).send("Topic or user not found");
    res.redirect("/topics");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const unsubscribeFromTopic = async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).send("Unauthorized");
    const { topicId } = req.params;
    const userId = req.session.userId;

    // Use $pull to remove entries atomically
    const topicUpdate = await Topic.findByIdAndUpdate(topicId, {
      $pull: { subscribers: userId },
    });
    const userUpdate = await User.findByIdAndUpdate(userId, {
      $pull: { subscribedTopics: topicId },
    });

    if (!topicUpdate || !userUpdate)
      return res.status(404).send("Topic or user not found");

    res.redirect("/topics");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getAllTopics = async (req, res) => {
    const userId = req.session.userId;
  try {
    // Fetch all topics and the current user's subscription list in parallel
    const [topics, user] = await Promise.all([
      Topic.find().populate("createdBy", "username").lean(),
      User.findById(userId).select("subscribedTopics").lean(),
    ]);

    res.render("topics", {
      topics,
      subscribedTopics: user?.subscribedTopics || [],
      userId,
    });
  } catch (error) {
    console.error("Dashboard Load Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
