const express = require("express");
const app = express();

app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/chats.html");
});

app.get("/chats.html", (req, res) => {
  res.sendFile(__dirname + "/chats.html");
});

app.get("/messages.html", (req, res) => {
  res.sendFile(__dirname + "/messages.html");
});
