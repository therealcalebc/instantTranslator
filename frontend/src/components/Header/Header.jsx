import { Paper, Typography } from "@material-ui/core";
// import { FormControlLabel, Paper, Switch, Typography } from "@material-ui/core";
// import { useState } from "react";
import styles from "./Header.module.css";

const Header = (props) => {
	// const { prefersDarkMode, updateTheme } = props;
	// const { colorScheme, setColorScheme } = useState(
	// 	prefersDarkMode ? "dark" : "light"
	// );
	// const [darkMode, setDarkMode] = useState(prefersDarkMode);
	// const toggleDarkMode = (e) => {
	// 	setDarkMode(e.target.checked);
	// 	updateTheme(e.target.checked ? "dark" : "light");
	// };
	return (
		<header className={styles.Header}>
			<Paper>
				{/* <div className={styles.title}> */}
				<Typography variant='h1' component='h1'>
					MERN Chat
				</Typography>
				{/* </div>
				<div className={styles.themeSwitch}>
					<FormControlLabel
						value='bottom'
						control={
							<Switch
								color='primary'
								checked={darkMode}
								onChange={toggleDarkMode}
							/>
						}
						label='Dark Mode'
						labelPlacement='bottom'
					/>
				</div> */}
			</Paper>
		</header>
	);
};

export default Header;
