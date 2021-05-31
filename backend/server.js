const express = require("express");
const http = require("http");
const cors = require("cors");
const xss = require("xss");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = require("socket.io")(server);

const sanitizeString = (str) => {
  return xss(str);
};

let connections = {};
let messages = {};
let timeOnline = {};

io.on("connection", (socket) => {
  socket.on("join-call", (path) => {
    if (connections[path] === undefined) {
      connections[path] = [];
    }
    connections[path].push(socket.id);

    timeOnline[socket.id] = new Date();

    for (let i = 0; i < connections[path].length; i++) {
      io.to(connections[path][i]).emit(
        "user-joined",
        socket.id,
        connections[path]
      );
    }

    if (messages[path] !== undefined) {
      for (let i = 0; i < messages[path].length; i++) {
        io.to(socket.id).emit(
          "chat-message",
          messages[path][i]["data"],
          messages[path][i]["sender"],
          messages[path][i]["socket-id-sender"]
        );
      }
    }
  });

  socket.on("signal", (toId, message) => {
    io.to(toId).emit("signal", socket.id, message);
  });

  socket.on("chat-message", (data, sender) => {
    data = sanitizeString(data);
    sender = sanitizeString(sender);

    let key;
    let ok = false;
    // Checking for key-value pairs
    for (const [k, v] of Object.entries(connections)) {
      for (let i = 0; i < v.length; i++) {
        if (v[i] === socket.id) {
          key = k;
          ok = true;
        }
      }
    }

    if (ok === true) {
      if (messages[key] === undefined) {
        messages[key] = [];
      }
      messages[key].push({
        sender: sender,
        data: data,
        "socket-id-sender": socket.id,
      });

      for (let i = 0; i < connections[key].length; i++) {
        io.to(connections[key][i]).emit(
          "chat-message",
          data,
          sender,
          socket.id
        );
      }
    }
  });

  socket.on("disconnect", () => {
    var diffTime = Math.abs(timeOnline[socket.id] - new Date());
    var key;
    // Checking for key-value pairs
    for (const [k, v] of JSON.parse(
      JSON.stringify(Object.entries(connections))
    )) {
      for (let i = 0; i < v.length; i++) {
        if (v[i] === socket.id) {
          key = k;

          for (let i = 0; i < connections[key].length; i++) {
            io.to(connections[key][i]).emit("user-left", socket.id);
          }

          var index = connections[key].indexOf(socket.id);
          connections[key].splice(index, 1);

          if (connections[key].length === 0) {
            delete connections[key];
          }
        }
      }
    }
  });
});

server.listen(5000, () => {
  console.log("The server is up and running");
});
