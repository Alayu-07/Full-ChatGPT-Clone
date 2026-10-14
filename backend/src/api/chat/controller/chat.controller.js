const {
  createConversationService,
  getRecentConversationRows,
  formatConversation
} = require("../service/chat.service");

// ======================================================
// POST /api/chat/conversations
// ======================================================

const createConversationController = async (
  req,
  res,
  next
) => {
  try {
    const { question } = req.body;
console.log(question, req.body);
    const result =
      await createConversationService(
        question
      );

    res.status(201).json({
      success: true,
      message:
        "Conversation posted successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET /api/chat/conversations
// ======================================================

const getConversationController = async (
  req,
  res,
  next
) => {
  try {
    const rows =
      await getRecentConversationRows(100);

    const conversations =
      rows.map(formatConversation);

    res.status(200).json({
      success: true,
      message:
        "Conversations fetched successfully.",
      data: {
        conversations
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createConversationController,
  getConversationController
};