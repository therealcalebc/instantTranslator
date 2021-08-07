require("./src/config/mongoose.config");
const express = require("express");

const dbApp = express();
dbApp.use(express.json());
dbApp.use(express.urlencoded({ extended: true }));
const cors = require("cors");
dbApp.use(cors());
require("./src/routes/users.routes")(dbApp);
require("./src/routes/rooms.routes")(dbApp);
const dbPort = 8000;
dbApp.listen(dbPort, () => {
	console.log(`The db server is listening... (port ${dbPort})`);
});

const chatApp = express();
const chatPort = 9000;
const chatServer = chatApp.listen(chatPort, () => {
	console.log(`The chat server is listening... (port ${chatPort})`);
});

const io = require("socket.io")(chatServer, { cors: true });
io.on("connection", (socket) => {
	// NOTE: Each client that connects gets their own socket id!
	console.log(`new connection: ${socket.id}`);
	socket.emit("welcome_msg", "Welcome to MERN Chat");
	// if this is logged in our terminal, that means a new client has successfully completed the handshake!
	// We add all of our additional event listeners right inside this function.
	// NOTE 'connection' is a BUILT IN event listener

	socket.on("connect_msg", (username) => {
		socket.broadcast.emit("connection_msg", `${username} joined`);
	});
	socket.on("room_created", () => {
		console.log(`socket.on(room_created) received from ${socket.id}`);
		socket.broadcast.emit("room_created");
	});
	socket.on("room_join", (room) => {
		console.log("socket.on(room_join).room:");
		console.log(room);
		console.log(socket.rooms);
		if (!socket.rooms.has(room)) socket.join(room);
		socket.emit("room_joined", room);
	});
	socket.on("tx_chat_msg", (data) => {
		// socket.broadcast will emit to all other clients besides the client who is actually emitting
		console.log("socket.on(tx_chat_msg).data:");
		console.log(data);
		if (data.room) socket.to(data.room).emit("rx_chat_msg", data);
		else socket.broadcast.emit("rx_chat_msg", data);
	});
	socket.on("disconnect", (reason) =>
		console.log(`SOCKET DISCONNECT (${socket.id}), reason: ${reason}`)
	);
});
