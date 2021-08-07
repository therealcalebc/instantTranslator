import { Button, FormControlLabel, Switch, TextField } from "@material-ui/core";
// import { useTheme } from "@material-ui/core/styles";
import TelegramIcon from "@material-ui/icons/Telegram";
import { navigate } from "@reach/router";
import axios from "axios";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import Message from "../../components/Chat/MsgWindow/Message/Message";
import styles from "./Chat.module.css";

const Chat = (props) => {
	console.log("Chat.props:");
	console.log(props);
	const { user, setUser } = props;
	const { darkMode, setDarkMode } = props;
	const [darkModeSwitch, setDarkModeSwitch] = useState(darkMode);
	// notice that we pass a callback function to initialize the socket
	// we don't need to destructure the 'setSocket' function since we won't be updating the socket state
	const [socket] = useState(() => io(":9000"));
	const [messages, setMessages] = useState([]);
	const [typedMsg, setTypedMsg] = useState("");
	const [rooms, setRooms] = useState([]);
	const [users, setUsers] = useState([]);
	const [creatingRoom, setCreatingRoom] = useState(false);
	const [newRoomName, setNewRoomName] = useState("");
	const [errNewRoom, setErrNewRoom] = useState({});
	// const newRoomNameInput = useRef(null);
	const [currentMsgTo, setCurrentMsgTo] = useState({ type: "", target: { _id: 0 } });
	// const theme = useTheme();
	const onDarkModeSwitch = (e) => {
		if (darkMode !== e.target.checked) setDarkMode(e.target.checked);
		setDarkModeSwitch(e.target.checked);
	};

	// const allChannels = useMemo(() => {
	// 	return [...rooms, ...users].sort((a, b) =>
	// 		a.name > b.name ? 1 : -1
	// 	);
	// }, [rooms, users]);

	useEffect(() => {
		// if (!user.name) return navigate("/");
		console.log(socket);
		if (!socket) return;
		// we need to set up all of our sevent listeners in the useEffect callback function
		// console.log("Is this running?");
		socket.on("connect", () => {
			//socket.emit('set_username', user.name);
			if (user.name) {
				setUser({ ...user, socketId: socket.id });
				axios
					.put(`http://localhost:8000/api/user/${user._id}`, {
						socketId: socket.id,
					})
					.then((res) => {
						console.log("Chat.updateUser(socketId).then().res:");
						console.log(res);
					})
					.catch((err) => {
						console.log("Chat.updateUser(socketId).catch().err:");
						console.log(err.response);
					});
			}
		});

		socket.on("welcome_msg", (msg) => {
			console.log("Chat.on(welcome_msg).msg:");
			console.log(msg);
			setMessages((prevMessages) => {
				return [{ message: msg }, ...prevMessages];
			});
			socket.emit("connect_msg", user.name);
		});

		socket.on("connection_msg", (msg) => {
			console.log(msg);
			setMessages((prevMessages) => {
				return [{ message: msg }, ...prevMessages];
			});
		});
		socket.on("room_created", () => {
			console.log("Chat.on(ROOM_CREATED)");
			axios
				.get("http://localhost:8000/api/rooms")
				.then((res) => {
					console.log("Chat.on(room_created).GetRooms.then().res:");
					console.log(res);
					setRooms(res.data.results);
				})
				.catch((err) => {
					console.log("Chat.GetRooms.catch().err:");
					console.log(err.response);
				});
		});

		socket.on("room_joined", (roomId) => {
			console.log("Chat.on(room_joined).roomId:");
			console.log(roomId);
			if (roomId !== currentMsgTo._id) setCurrentMsgTo(rooms.find((el) => el._id === roomId));
		});

		socket.on("rx_chat_msg", (data) => {
			console.log("Chat.on(rx_chat_msg).data:");
			console.log(data);
			setMessages((prevMessages) => {
				return [data, ...prevMessages];
			});
		});

		socket.on("disconnect", (reason) => {
			console.log(`SOCKET DISCONNECT (${socket.id}), reason: ${reason}`);
			if (user.name) {
				setUser({ ...user, socketId: undefined });
				axios
					.put(`http://localhost:8000/api/user/${user._id}`, {
						socketId: undefined,
					})
					.then((res) => {
						console.log("Chat.updateUser(socketId).then().res:");
						console.log(res);
					})
					.catch((err) => {
						console.log("Chat.updateUser(socketId).catch().err:");
						console.log(err.response);
					});
			}
		});

		// NOTE that we're returning a callback function
		// this ensures that the underlying socket will be closed if App is unmounted
		// this would be more critical if we were creating the socket in a subcomponent
		return () => socket.disconnect(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	useEffect(() => {
		if (!user.name) return navigate("/");
		if (socket && socket.connected && user.socketId !== socket.id)
			setUser({ ...user, socketId: socket.id });
	}, [setUser, socket, user]);

	useEffect(() => {
		axios
			.get("http://localhost:8000/api/rooms")
			.then((res) => {
				console.log("Chat.GetRooms.then().res:");
				console.log(res);
				setRooms(res.data.results);
			})
			.then(() => {
				return axios.get("http://localhost:8000/api/users").then((res) => {
					console.log("Chat.GetUsers.then().res:");
					console.log(res);
					setUsers(res.data.results);
				});
			})
			.catch((err) => {
				console.log("Chat.GetRooms/Users.catch().err:");
				console.log(err.response);
			});
	}, []);

	// const handleMsgTyping = (e) => setTypedMsg(e.target.value);

	const handleMsgSend = () => {
		const newMsg = { sender: user, message: typedMsg };
		if (currentMsgTo) newMsg.to = currentMsgTo;
		console.log("Chat.onMsgSend().newMsg:");
		console.log(newMsg);
		console.log(socket);
		socket.emit("tx_chat_msg", newMsg);
		setMessages((prevMessages) => [newMsg, ...prevMessages]);
		setTypedMsg("");
	};

	const createRoom = () => {
		// if (!newRoomName)
		// 	setErrNewRoom({ message: "Enter a name for the new room" });
		// else if (newRoomName in rooms)
		// 	setErrNewRoom({ message: "Room name already taken" });
		// else {
		// 	const newRoom = {
		// 		_id: new Date(),
		// 		name: newRoomName,
		// 		members: [user],
		// 	};
		// 	setCreatingRoom(false);
		// 	setRooms((prevRooms) => [...prevRooms, newRoom]);
		// }
		// create room in db
		const newRoom = { name: newRoomName, members: [user._id] };
		axios
			.post("http://localhost:8000/api/room", { name: newRoomName })
			.then((res) => {
				console.log(res);
				if (res.data)
					setErrNewRoom({
						message: "Room name already taken",
					});
				else
					return axios.post("http://localhost:8000/api/rooms", newRoom).then((res) => {
						if (res) {
							console.log(res);
							// then socket request to join room
							socket.emit("room_created");
							socket.emit("room_join", res.data._id);
							setCurrentMsgTo(res.data);
							setCreatingRoom(false);
							setNewRoomName("");
							setRooms((prevRooms) => {
								return [...prevRooms, res.data];
							});
						}
					});
			})
			.catch((err) => {
				console.log(err);
				console.log(err.response);
				// setErrNewRoom(err.response.data.errors);
			});
		// then navigate('room')  (**update router logic)
		//    ***messages should filter based on path (':room')
		// setCurrentRoom(newRoom);
		// setCreatingRoom(false);
		// setNewRoomName("");
	};
	const handleNewRoom = () => {
		if (creatingRoom) createRoom();
		else setCreatingRoom(true);
	};
	// useEffect(() => {
	// 	if (newRoomNameInput.current) {
	// 		newRoomNameInput.current.onBlur = () => {
	// 			console.log("newRoomNameInput.current.onBlur()");
	// 			return setCreatingRoom(false);
	// 		};
	// 	}
	// }, [newRoomNameInput]);

	const onClickRoom = (room) => {
		console.log("Chat.onClickRoom().room:");
		console.log(room);
		console.log(socket);
		//switch to room based on which one is clicked...
		socket.emit("room_join", room._id);
		setCurrentMsgTo({ type: "group_msg", target: room });
		if (room.members && !room.members.includes(user._id)) {
			axios
				.put(`http://localhost:8000/api/room/${room._id}`, user._id)
				.then((res) => {
					console.log(`Chat.onClickRoom(${room.name}).updateMembers.then().res:`);
					console.log(res);
				})
				.catch((err) => {
					console.log(`Chat.onClickRoom(${room.name}).updateMembers.catch().err:`);
					console.log(err);
				});
		}
	};

	const onClickUser = (user) => {
		console.log("Chat.onClickUser().user:");
		console.log(user);
		console.log(socket);
		//switch to room based on which one is clicked...
		// socket.emit("room_join", user._id);
		setCurrentMsgTo({ type: "direct_msg", target: user });
	};

	return (
		<>
			<main className={styles.Chat}>
				<div className={styles.sidebar}>
					<div className={styles.addRoom}>
						<Button
							variant='contained'
							color={creatingRoom ? "primary" : "default"}
							// startIcon={<TelegramIcon />}
							onClick={handleNewRoom}>
							{creatingRoom ? "Create Room" : "Add Room"}
						</Button>
						{creatingRoom && (
							<TextField
								fullWidth
								required
								variant='filled'
								color='primary'
								label='Room Name'
								value={newRoomName}
								onChange={(e) => setNewRoomName(e.target.value)}
								error={errNewRoom.name}
								helperText={errNewRoom.name ? errNewRoom.name.message : ""}
							/>
						)}
					</div>
					<div className={styles.nav}>
						{rooms &&
							currentMsgTo &&
							rooms.map((room) => (
								<div key={room._id}>
									<Button
										variant={
											room._id === currentMsgTo.target._id
												? "outlined"
												: "text"
										}
										color={
											room._id === currentMsgTo.target._id
												? "primary"
												: "default"
										}
										onClick={() => onClickRoom(room)}>
										{room.name}
									</Button>
								</div>
							))}
					</div>
				</div>
				<div className={styles.MsgWindow}>
					{messages &&
						messages
							.filter((msg) => {
								console.log("Chat.messages.filter().msg:");
								console.log(msg);
								return (
									!msg.sender ||
									(!msg.to && !currentMsgTo) ||
									(msg.to &&
										currentMsgTo &&
										((msg.to.type === "group_msg" &&
											msg.to.target._id === currentMsgTo.target._id) ||
											(msg.to.type === "direct_msg" &&
												msg.sender._id === currentMsgTo.target._id)))
								);
							})
							.map((msg, idx) => {
								console.log("Chat.messages.map().msg:");
								console.log(msg);
								return <Message key={idx} data={msg} user={user} />;
							})}
				</div>
				<div className={styles.sidebar}>
					<h3>All Rooms</h3>
					{rooms &&
						currentMsgTo &&
						rooms.map((room) => {
							return (
								<div key={room._id}>
									<Button
										variant={
											room._id === currentMsgTo._id ? "outlined" : "text"
										}
										color={
											room._id === currentMsgTo._id ? "primary" : "default"
										}
										onClick={() => onClickRoom(room)}>
										{room.name}
									</Button>
								</div>
							);
						})}
					<hr />
					<h3>All Users</h3>
					{users &&
						users.map((user) => {
							return (
								<div key={user._id}>
									<Button
										variant={"text"}
										color={user.socketId ? "success" : "secondary"}
										onClick={() => onClickUser(user)}>
										{user.name}
									</Button>
								</div>
							);
						})}
				</div>
			</main>
			<footer>
				<div className={styles.themeSwitch}>
					<FormControlLabel
						value='bottom'
						control={
							<Switch
								color='primary'
								checked={darkModeSwitch}
								onChange={onDarkModeSwitch}
							/>
						}
						label='Dark Mode'
						labelPlacement='bottom'
					/>
				</div>
				<div className={styles.msgInput}>
					<TextField
						fullWidth
						variant='filled'
						color='primary'
						label='Say something...'
						value={typedMsg}
						onChange={(e) => setTypedMsg(e.target.value)}
					/>
				</div>
				<div className={styles.msgSend}>
					<Button
						variant='contained'
						color='primary'
						startIcon={<TelegramIcon />}
						onClick={handleMsgSend}>
						Send
					</Button>
				</div>
			</footer>
		</>
	);
};

export default Chat;
