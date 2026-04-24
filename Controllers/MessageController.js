import { Message } from "../Models/Message.js";
import { Topic } from "../Models/Topic.js";
import { User } from "../Models/User.js";
import { eventBus } from "../others/events/eventBus.js";

export const createMessage = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { body } = req.body;
    const userId = req.session.userId;

    const message = await Message.create({
      topicId,
      userId,
      body,
    });
    eventBus.emit("messageCreated", {
      topicId,
      userId,
      body,
      messageId: message._id,
    });
    res.redirect(`/topics/${topicId}`);
  } catch (error) {
    console.error("Create Message Error:", error);
    res.status(500).send("Error posting new message: " + error.message);
  }
};

export const getThread = async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.session.userId;
    const [topic, messages, user] = await Promise.all([
      Topic.findById(topicId).lean(),
      Message.find({ topicId })
        .populate("userId", "username")
        .sort({ createdAt: -1 })
        .lean(),
      User.findById(userId).select("subscribedTopics").lean(),
    ]);

    if (!topic) return res.status(404).send("Topic not found");

    // Increment timesAccessed when a topic thread is viewed
    await Topic.findByIdAndUpdate(topicId, { $inc: { timesAccessed: 1 } });

    res.render("thread", {
      topicId,
      topic,
      messages,
      subscribedTopics: user?.subscribedTopics || [],
      error: null,
      username: user?.username || "",
    });
  } catch (error) {
    res.status(500).send("Error getting thread");
  }
};

export const getDashboard = async (req, res) => {
  try {
    const userId = req.session.userId;
    const [topics, user] = await Promise.all([
      Topic.find().populate("createdBy", "username").lean(),
      User.findById(userId).select("subscribedTopics").lean(),
    ]);

    const topicsWithMessages = await Promise.all(
      topics.map(async (topic) => {
        const messages = await Message.find({ topicId: topic._id })
          .sort({ createdAt: -1 })
          .limit(2)
          .populate("userId", "username")
          .lean();
        return { topic, messages, timesAccessed: topic.timesAccessed };
      }),
    );
    res.render("dashboard", {
      topicsWithMessages,
      userId,
      subscribedTopics: user?.subscribedTopics || [],
      error: null,
      username: user?.username || "",
    });
  } catch (error) {
    console.error("Dashboard Load Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
