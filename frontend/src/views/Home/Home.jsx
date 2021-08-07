import { Button, Paper, TextField, Typography } from "@material-ui/core";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import { navigate } from "@reach/router";
import axios from "axios";
import { useState } from "react";
import styles from "./Home.module.css";

const Home = (props) => {
	const { setUser } = props;
	const [name, setDisplayName] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		// setUser({ name: name, _id: new Date() });
		// navigate("chat");
		axios //findUser
			.post("http://localhost:8000/api/user", {
				name: name,
			})
			.then((res) => {
				console.log("Home.handleSubmit.findUser.then(res):");
				console.log(res);
				if (res.data) {
					setUser(res.data);
					navigate("chat");
				} else {
					axios //createUser
						.post("http://localhost:8000/api/users", {
							name: name,
						})
						.then((res) => {
							console.log("Home.handleSubmit.createUser.then(res):");
							console.log(res);
							setUser(res.data);
							navigate("chat");
						})
						.catch((err) => {
							console.log("Home.handleSubmit.createUser.catch(err.response):");
							console.log(err.response);
						});
				}
			})
			.catch((err) => {
				console.log("Home.handleSubmit.findUser.catch(err.response):");
				console.log(err.response);
			});
	};

	return (
		<main className={styles.Home}>
			<Paper className={styles.paperPad}>
				<Typography variant='h2' component='h2'>
					Get started right now!
				</Typography>
				<br />
				<div className={styles.Form}>
					<Typography variant='subtitle1' component='p'>
						I want to start chatting with the name...
					</Typography>
					<div className={styles.formInput}>
						<TextField
							required
							fullWidth
							variant='filled'
							color='primary'
							label='Display Name'
							value={name}
							onChange={(e) => setDisplayName(e.target.value)}
						/>
					</div>
					<div className={styles.formSubmit}>
						<Button
							type='submit'
							variant='contained'
							color='primary'
							startIcon={<QuestionAnswerIcon />}
							onClick={handleSubmit}>
							Start Chatting
						</Button>
						{/* <button type='submit'>Start Chatting</button> */}
					</div>
				</div>
			</Paper>
		</main>
	);
};

export default Home;
