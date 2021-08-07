const { User } = require("../models/user.model");

module.exports.findAllUsers = (req, res) => {
	User.find()
		.then((allTheUsers) => {
			res.json({ results: allTheUsers });
		})
		.catch((err) => res.status(400).json(err));
};

module.exports.findOneUserByProperty = (req, res) => {
	User.findOne(req.body)
		.then((theUser) => {
			res.json(theUser);
		})
		.catch((err) => res.status(400).json(err));
};

module.exports.findOneUserById = (req, res) => {
	User.findOne({ _id: req.params.id })
		.then((theUser) => {
			res.json(theUser);
		})
		.catch((err) => res.status(400).json(err));
};

module.exports.updateUser = (req, res) => {
	User.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	})
		.then((updatedUser) => {
			res.json(updatedUser);
		})
		.catch((err) => res.status(400).json(err));
};

module.exports.createUser = (req, res) => {
	const { name } = req.body;
	User.create({
		name,
	})
		.then((user) => res.json(user))
		.catch((err) => res.status(400).json(err));
};

module.exports.deleteUser = (req, res) => {
	User.deleteOne({ _id: req.params.id })
		.then((deleteConfirmation) => res.json(deleteConfirmation))
		.catch((err) => res.status(400).json(err));
};
