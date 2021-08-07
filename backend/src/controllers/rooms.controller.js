const { Room } = require("../models/room.model");

module.exports.findAllRooms = (req, res) => {
	Room.find()
		.then((allTheRooms) => {
			res.json({ results: allTheRooms });
		})
		.catch((err) => res.status(400).json(err));
};

module.exports.findOneRoomByProperty = (req, res) => {
	Room.findOne(req.body)
		.then((theRoom) => {
			res.json(theRoom);
		})
		.catch((err) => res.status(400).json(err));
};

module.exports.findOneRoomById = (req, res) => {
	Room.findOne({ _id: req.params.id })
		.then((theRoom) => {
			res.json(theRoom);
		})
		.catch((err) => res.status(400).json(err));
};

module.exports.updateRoom = (req, res) => {
	Room.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	})
		.then((updatedRoom) => {
			res.json(updatedRoom);
		})
		.catch((err) => res.status(400).json(err));
};

module.exports.createRoom = (req, res) => {
	const { name, members } = req.body;
	Room.create({
		name,
		members,
	})
		.then((room) => res.json(room))
		.catch((err) => res.status(400).json(err));
};

module.exports.deleteRoom = (req, res) => {
	Room.deleteOne({ _id: req.params.id })
		.then((deleteConfirmation) => res.json(deleteConfirmation))
		.catch((err) => res.status(400).json(err));
};
