const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());
const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});
app.post("/events", (req, res) => {
  const { type, data } = req.body;
  console.log("Event sent:", { type, data });
  console.log(type, data);
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find((c) => c.id === id);
    if (comment) {
      comment.status = status;
      comment.content = content;
    } else {
      console.error(`Comment with id ${id} not found on post ${postId}`);
    }
  }
  console.log(posts);

  res.sendStatus(200);
});

app.listen(4002, () => {
  console.log("running on 4002");
});
