import { Card, CardContent, Typography } from "@material-ui/core";
import styles from "./Message.module.css";

const ChatMessage = (props) => {
	const { data, user } = props;
	const { message, sender } = data;
	const classNames =
		`${styles.ChatMessage} ` +
		(!sender
			? styles.systemMsg
			: sender._id === user._id
			? styles.sentMsg
			: styles.receivedMsg);

	return (
		<div className={classNames}>
			{/* <div className={styles.ChatMessage}>
			{!sender && <div className={styles.systemMsg}>{message}</div>} */}
			{!sender && <>{message}</>}
			{sender && sender._id !== user._id && (
				<>
					<Card raised>
						<CardContent>
							<Typography variant='subtitle2' component='p'>
								{sender.name} said:
							</Typography>
							<Typography variant='subtitle1' component='p'>
								{" "}
								{message}
							</Typography>
						</CardContent>
					</Card>
				</>
			)}
			{sender && sender._id === user._id && (
				<>
					<Card raised style={{ backgroundColor: "#64b5f6" }}>
						<CardContent>
							<Typography variant='subtitle2' component='p'>
								You said:
							</Typography>
							<Typography variant='subtitle1' component='p'>
								{" "}
								{message}
							</Typography>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
};

export default ChatMessage;
