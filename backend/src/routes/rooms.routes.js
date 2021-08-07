const RoomController = require("../controllers/rooms.controller");
module.exports = (app) => {
	app.get("/api/rooms/", RoomController.findAllRooms);
	app.get("/api/rooms/:id", RoomController.findOneRoomById);
	app.put("/api/room/:id", RoomController.updateRoom);
	app.post("/api/rooms/", RoomController.createRoom);
	app.post("/api/room/", RoomController.findOneRoomByProperty);
	app.delete("/api/rooms/:id", RoomController.deleteRoom);
};
