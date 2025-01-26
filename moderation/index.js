const express = require("express");
const axios = require("axios");

// const bodyParser = require("body-parser");

const app = express();
app.use(express.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (!type || !data) {
    return res.status(400).send("Invalid event format");
  }
  if (type === "PostCreated") return;
  if (type === "CommentModerated") {
    return res.sendStatus(200);
  }
  const { id, content, postId, status } = data;
  const commentData = { id, content, postId, status };

  console.log("this is commentData", commentData);

  if (type === "CommentCreated") {
    if (content.includes("orange")) {
      commentData.status = "rejected";
    } else {
      commentData.status = "approved";
    }
  }

  await axios
    .post("http://localhost:4005/events", {
      type: "CommentModerated",
      data: { id, content, postId, status },
    })
    .catch((err) => console.log(err));

  res.sendStatus(200);
});

app.listen(4003, () => {
  console.log("listening on 4003");
});
