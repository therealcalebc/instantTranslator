import { Button } from "@material-ui/core";
import styles from "./RightSidebar.module.css";

const RightSidebar = (props) => {
	const { currentMsgTo, onClickRoom, onClickUser, rooms, users } = props;

	return (
		<div className={styles.root}>
			<h3>All Rooms</h3>
			{rooms &&
				currentMsgTo &&
				rooms.map((room) => {
					return (
						<div key={room._id}>
							<Button
								variant={room._id === currentMsgTo._id ? "outlined" : "text"}
								color={room._id === currentMsgTo._id ? "primary" : "default"}
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
	);
};

export default RightSidebar;
