import { Button, FormControlLabel, Switch, TextField } from "@material-ui/core";
import TelegramIcon from "@material-ui/icons/Telegram";
import { useState } from "react";
import styles from "./BottomBar.module.css";

const BottomBar = (props) => {
	const { currentMsgTo, sendMsg, user } = props;
	const { darkMode, setDarkMode } = props;
	const [darkModeSwitch, setDarkModeSwitch] = useState(darkMode);
	const [typedMsg, setTypedMsg] = useState("");

	const onDarkModeSwitch = (e) => {
		if (darkMode !== e.target.checked) setDarkMode(e.target.checked);
		setDarkModeSwitch(e.target.checked);
	};

	const handleMsgSend = () => {
		const newMsg = { sender: user, message: typedMsg };
		if (currentMsgTo) newMsg.to = currentMsgTo;
		console.log("Chat.BottomBar.onMsgSend().newMsg:");
		console.log(newMsg);
		sendMsg(newMsg);
		setTypedMsg("");
	};

	return (
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
	);
};

export default BottomBar;
