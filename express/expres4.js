const express = require("express");
const app = express();
const port = 3000;
var fs = require("fs");
const path = require("path");

// Middleware to handle jsons and URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes go here

//Default route handler
app.get("/", function (req, res, next) {
  res.send("You did not send me anything");
});

//  How to grab data from a POST request
app.post("/post/users", function (req, res) {
  const formBody = req.body;
  var outstring = "";
  for (var key in formBody) {
    outstring += "--" + key + ">" + formBody[key];
  }

  res.send(
    "The formBody is: " +
      JSON.stringify(formBody) +
      "<br>The outstring is: " +
      outstring,
  );
});

// Using a local file to generate a web form (like post.html)
app.get("/getfile", function (req, res) {
  res.sendFile(path.join(__dirname, "post.html"));
});

app.listen(port, () => {
  console.log("Server started at http://localhost:" + port);
});
