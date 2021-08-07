require("./src/config/mongoose.config");

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require("cors");
app.use(cors());
require("./src/routes/users.routes")(app);
require("./src/routes/rooms.routes")(app);

const port = 8000;
const server = app.listen(port, () => {
	console.log(`The server is listening... (port ${port})`);
});

const io = require("socket.io")(server, { cors: true });
io.on("connection", (socket) => {
	// NOTE: Each client that connects gets their own socket id!
	console.log(`new connection: ${socket.id}`);
	socket.emit("welcome_msg", "Welcome to MERN Chat");
	// if this is logged in our terminal, that means a new client has successfully completed the handshake!
	// We add all of our additional event listeners right inside this function.
	// NOTE 'connection' is a BUILT IN event listener

	socket.on("connect_msg", (data) => {
		socket.broadcast.emit("connection_msg", `${data.displayName} joined`);
	});
	socket.on("room_join", (room) => {
		console.log("socket.on(room_join).room:");
		console.log(room);
		// if (!socket.rooms.includes(room._id)) {
		socket.join(room._id);
		socket.emit("room_joined", room);
		socket.broadcast.emit("room_created");
		// }
	});
	socket.on("tx_chat_msg", (data) => {
		// socket.broadcast will emit to all other clients besides the client who is actually emitting
		console.log("socket.on(tx_chat_msg).data:");
		console.log(data);
		if (data.room) socket.to(data.room._id).emit("rx_chat_msg", data);
		else socket.broadcast.emit("rx_chat_msg", data);
	});
});
