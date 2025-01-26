const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  const comments = commentsByPostId[req.params.id] || [];
  res.status(200).send(comments);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const postId = req.params.id;
  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: "pending" });

  commentsByPostId[postId] = comments;

  console.log("Updated commentsByPostId:", commentsByPostId);
  await axios
    .post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId,
        status: "pending",
      },
    })
    .catch((err) => console.log(err));

  console.log("comments here", comments);
  console.log("commentsByPostIdHere", commentsByPostId);

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log(commentsByPostId);
  const { type, data } = req.body;
  console.log("Event sent:", { type, data });
  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];
    console.log(
      "postid, id,content, status, and comments and commentsByPostId",
      postId,
      id,
      content,
      status,
      comments,
      commentsByPostId
    );
    console.log("Comments for postId:", postId, comments);
    if (!comments) {
      return res
        .status(400)
        .send({ error: "Post ID not found in commentsByPostId" });
    }
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    console.log("comment if any", comment);
    console.log("post id, id ,and status", postId, id, status);
    if (!comment) {
      return res.status(400).send({ message: "no comment with this id" });
    }
    comment.status = status;
    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: { id, status, postId, content },
    });
  }

  res.sendStatus(200);
});

app.listen(4001, () => {
  console.log("listening on 4001");
});
