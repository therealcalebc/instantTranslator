import { Button, ClickAwayListener, TextField } from "@material-ui/core";
import axios from "axios";
import { useState } from "react";
import styles from "./LeftSidebar.module.css";

const LeftSidebar = (props) => {
	const {
		currentMsgTo,
		setCurrentMsgTo,
		onClickRoom,
		// onClickUser,
		rooms,
		setRooms,
		socket,
		user,
		// users,
	} = props;
	const [creatingRoom, setCreatingRoom] = useState(false);
	const [newRoomName, setNewRoomName] = useState("");
	const [errNewRoom, setErrNewRoom] = useState({});

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

	// const handleClickAway = () => {
	// 	if(creatingRoom) setCreatingRoom(false);
	// };

	return (
		<div className={styles.root}>
			<ClickAwayListener
				onClickAway={() => {
					if (creatingRoom) setCreatingRoom(false);
				}}>
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
			</ClickAwayListener>
			<div className={styles.nav}>
				{rooms &&
					currentMsgTo &&
					rooms.map((room) =>
						room ? (
							<div key={room._id}>
								<Button
									variant={
										room._id === currentMsgTo.target._id ? "outlined" : "text"
									}
									color={
										room._id === currentMsgTo.target._id ? "primary" : "default"
									}
									onClick={() => onClickRoom(room)}>
									{room.name}
								</Button>
							</div>
						) : null
					)}
			</div>
		</div>
	);
};

export default LeftSidebar;
