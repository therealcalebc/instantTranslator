import Message from "./Message/Message";
import styles from "./MsgWindow.module.css";

const MsgWindow = (props) => {
	const { currentMsgTo, messages, user } = props;

	return (
		<div className={styles.root}>
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
	);
};

export default MsgWindow;
