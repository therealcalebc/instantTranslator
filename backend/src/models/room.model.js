const mongoose = require("mongoose");
const RoomSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "A name is required"],
		},
		members: [String],
	},
	{ timestamps: true }
);
module.exports.Room = mongoose.model("Room", RoomSchema);
