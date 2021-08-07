// import { Button, TextField } from "@material-ui/core";
// import { useTheme } from "@material-ui/core/styles";
import { navigate } from "@reach/router";
import axios from "axios";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import BottomBar from "../../components/Chat/BottomBar/BottomBar";
import LeftSidebar from "../../components/Chat/LeftSidebar/LeftSidebar";
// import Message from "../../components/Chat/MsgWindow/Message/Message";
import MsgWindow from "../../components/Chat/MsgWindow/MsgWindow";
import RightSidebar from "../../components/Chat/RightSidebar/RightSidebar";
import styles from "./Chat.module.css";

const Chat = (props) => {
	console.log("Chat.props:");
	console.log(props);
	const { user, setUser } = props;
	// notice that we pass a callback function to initialize the socket
	// we don't need to destructure the 'setSocket' function since we won't be updating the socket state
	const [socket] = useState(() => io(":9000"));
	const [messages, setMessages] = useState([]);
	const [rooms, setRooms] = useState([]);
	const [users, setUsers] = useState([]);
	// const newRoomNameInput = useRef(null);
	const [currentMsgTo, setCurrentMsgTo] = useState({ type: "", target: { _id: 0 } });
	// const theme = useTheme();

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
			getRooms();
			/* axios
				.get("http://localhost:8000/api/rooms")
				.then((res) => {
					console.log("Chat.on(room_created).GetRooms.then().res:");
					console.log(res);
					setRooms(res.data.results);
				})
				.catch((err) => {
					console.log("Chat.on(room_created).GetRooms.catch().err:");
					console.log(err.response);
				}); */
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

	/* useEffect(() => {
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
	}, []); */
	useEffect(() => {
		getRooms();
		getUsers();
	}, []);

	const sendMsg = (newMsg) => {
		console.log(socket);
		if (socket) {
			socket.emit("tx_chat_msg", newMsg);
			setMessages((prevMessages) => [newMsg, ...prevMessages]);
		} else console.log("Chat.sendMsg(newMsg): NO SOCKET\n Couldn't send message:\n" + newMsg);
	};

	const getRooms = () => {
		axios
			.get("http://localhost:8000/api/rooms")
			.then((res) => {
				console.log("Chat.getRooms.then().res:");
				console.log(res);
				setRooms(res.data.results);
			})
			.catch((err) => {
				console.log("Chat.getRooms.catch().err:");
				console.log(err.response);
			});
	};

	const getUsers = () => {
		axios
			.get("http://localhost:8000/api/users")
			.then((res) => {
				console.log("Chat.getUsers.then().res:");
				console.log(res);
				setUsers(res.data.results);
			})
			.catch((err) => {
				console.log("Chat.getUsers.catch().err:");
				console.log(err.response);
			});
	};

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
			<main className={styles.root}>
				<LeftSidebar
					currentMsgTo={currentMsgTo}
					setCurrentMsgTo={setCurrentMsgTo}
					onClickRoom={onClickRoom}
					onClickUser={onClickUser}
					rooms={rooms}
					setRooms={setRooms}
					socket={socket}
					user={user}
					users={users}
				/>
				<MsgWindow currentMsgTo={currentMsgTo} messages={messages} user={user} />
				<RightSidebar
					currentMsgTo={currentMsgTo}
					onClickRoom={onClickRoom}
					onClickUser={onClickUser}
					rooms={rooms}
					users={users}
				/>
			</main>
			<BottomBar
				currentMsgTo={currentMsgTo}
				darkMode={props.darkMode}
				setDarkMode={props.setDarkMode}
				sendMsg={sendMsg}
				user={user}
			/>
		</>
	);
};

export default Chat;
