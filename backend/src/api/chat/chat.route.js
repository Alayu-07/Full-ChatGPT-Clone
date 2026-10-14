// const express = require("express");

// const {
//   createConversationController,
//   getConversationController
// } = require("./controller/chat.controller");

// const chatRouter = express.Router();

// chatRouter.get(
//   "/conversations",
//   getConversationController
// );

// chatRouter.post(
//   "/conversations",
//   createConversationController
// );

// module.exports = chatRouter;




const express = require("express");

const {
  createConversationController,
  getConversationController,
} = require("./controller/chat.controller");

const chatRouter =
  express.Router();

chatRouter.get(
  "/conversations",
  getConversationController
);

chatRouter.post(
  "/conversations",
  createConversationController
);

module.exports = chatRouter;