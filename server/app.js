import { port } from "./config.js";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import * as socketHandlers from "./sockethandlers.js";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json()); // To parse the incoming requests with JSON payloads

app.use(express.static("public"));

let httpServer = http.createServer(app);

// set EST
process.env.TZ = "America/New_York";

// Socket.io server
const io = new Server(httpServer, {});
io.on("connection", (socket) => {
    console.log("new connection established");
    socketHandlers.handleGetRoomsAndUsers(io);
    // Scenario #1 - User attempts to join a room
    socket.on("join", (clientData) => {
        socketHandlers.handleJoin(socket, clientData);
        socketHandlers.handleGetRoomsAndUsers(io);
    });
    // scenario 2 - Client disconnects from server
    socket.on("disconnect", () => {
        socketHandlers.handleDisconnect(socket);
        socketHandlers.handleGetRoomsAndUsers(io);
    });
    // scenario 3 - client sends notification that user started typing
    socket.on("typing", (clientData) => {
        socketHandlers.handleTyping(socket, clientData);
    });
    // scenario 4 - client sends message to room including self
    socket.on("message", (clientData) => {
        socketHandlers.handleMessage(io, socket, clientData);
    });
});


// will pass 404 to error handler
app.use((req, res, next) => {
    const error = new Error("No such route found");
    error.status = 404;
    next(error);
});

// error handler middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || "Internal Server Error",
        },
    });
});

httpServer.listen(port, () => {
    console.log(`listening on port ${port}`);
});