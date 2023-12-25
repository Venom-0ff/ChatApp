import matColours from "./matdes100colours.json" assert { type: "json" };
import moment from "moment";

let users = []; // [{ id: null, userName: "", roomName: "", color: "" }]

const handleJoin = (socket, clientData) => {
    try {
        const coloridx = Math.floor(Math.random() * matColours.colours.length) + 1;
        if (users.find(user => user.userName === clientData.userName && user.roomName === clientData.roomName)) {
            socket.emit("nameexists", "Name is already taken, try a different name");
        }
        else {
            socket.join(clientData.roomName);
            socket.emit("welcome", {
                senderName: "Admin",
                text: `Welcome ${clientData.userName}!`,
                color: "#ff0000",
                time: moment().format("hh:mm a DD-MM-YYYY")
            });
            socket.to(clientData.roomName)
                .emit("someonejoined", {
                    senderName: "Admin",
                    text: `${clientData.userName} has joined the chat ${clientData.roomName}!`,
                    color: "#ff0000",
                    time: moment().format("hh:mm a DD-MM-YYYY")
                });
            users.push({
                id: socket.id,
                userName: clientData.userName,
                roomName: clientData.roomName,
                color: matColours.colours[coloridx]
            });
        }
    } catch (error) {
        console.log(error);
    }
};

const handleDisconnect = (socket) => {
    try {
        const disconnectedUser = users.find(user => user.id === socket.id);
        users = users.filter(user => user.id !== socket.id);
        socket.to(disconnectedUser.roomName)
            .emit("someoneleft", {
                senderName: "Admin",
                text: `${disconnectedUser.userName} has left the chat ${disconnectedUser.roomName}!`,
                color: "#ff0000",
                time: moment().format("hh:mma a DD-MM-YYYY")
            });
    } catch (error) {
        console.log(error);
    }
};

const handleTyping = (socket, clientData) => {
    try {
        let msg = {
            senderName: clientData.userName,
            text: `${clientData.userName} is typing...`,
            color: users.find(user => user.id === socket.id).color
        };
        socket.to(clientData.roomName)
            .emit("someoneistyping", msg);
    } catch (error) {
        console.log(error);
    }
};

const handleMessage = (io, socket, clientData) => {
    try {
        let msg = {
            senderName: clientData.userName,
            text: clientData.text,
            color: users.find(user => user.id === socket.id).color,
            time: moment().format("hh:mm a DD-MM-YYYY")
        };
        io.in(clientData.roomName).emit("newmessage", msg);
    } catch (error) {
        console.log(error);
    }
};

const handleGetRoomsAndUsers = (io) => {
    try {
        io.emit("onlinechange", users);
    } catch (error) {
        console.log(error);
    }
};

export {
    handleJoin,
    handleDisconnect,
    handleTyping,
    handleMessage,
    handleGetRoomsAndUsers,
};