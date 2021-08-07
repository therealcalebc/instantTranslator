const UserController = require("../controllers/users.controller");
module.exports = (app) => {
	app.get("/api/users/", UserController.findAllUsers);
	app.get("/api/users/:id", UserController.findOneUserById);
	app.put("/api/user/:id", UserController.updateUser);
	app.post("/api/users/", UserController.createUser);
	app.post("/api/user/", UserController.findOneUserByProperty);
	app.delete("/api/users/:id", UserController.deleteUser);
};
