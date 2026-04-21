import { eventBus } from "../events/eventBus.js";

eventBus.on("messageCreated", async (data) => {
  try {
    console.log("Event received: messageCreated");

    const { topicId, userId, body } = data;

    console.log(`New message in topic ${topicId}: ${body}`);
  } catch (error) {
    console.error("Feed update error:", error);
  }
});
