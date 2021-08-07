const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "A name is required"],
		},
		socketId: String,
		rooms: [String],
		users: [String],
	},
	{ timestamps: true }
);
module.exports.User = mongoose.model("User", UserSchema);
