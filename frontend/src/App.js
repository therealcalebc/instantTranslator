import { CssBaseline, Container, Paper } from "@material-ui/core";
import { Router } from "@reach/router";
import { useState } from "react";
import ThemeController from "./components/ThemeController/ThemeController";
import Header from "./components/Header/Header";
import Home from "./views/Home/Home";
import Chat from "./views/Chat/Chat";
import "./App.css";

function App() {
	const [user, setUser] = useState({});
	const [darkMode, setDarkMode] = useState(
		window.matchMedia("(prefers-color-scheme: dark)").matches
	);

	return (
		<div className='App'>
			<ThemeController darkMode={darkMode}>
				<CssBaseline />
				<Container>
					<Paper>
						<Header />
						<Router>
							<Home path='/' setUser={setUser} />
							<Chat
								path='/chat'
								darkMode={darkMode}
								setDarkMode={setDarkMode}
								setUser={setUser}
								user={user}
							/>
						</Router>
					</Paper>
				</Container>
			</ThemeController>
		</div>
	);
}

export default App;

// import useMediaQuery from "@material-ui/core/useMediaQuery";
// import {
// 	createMuiTheme,
// 	responsiveFontSizes,
// 	ThemeProvider,
// } from "@material-ui/core/styles";
// const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
// const [themeType, setThemeType] = useState(
// 	prefersDarkMode ? "dark" : "light"
// );
// const [theme, setTheme] = useState(
// 	responsiveFontSizes(
// 		createMuiTheme({
// 			palette: {
// 				type: prefersDarkMode ? "dark" : "light",
// 			},
// 		})
// 	)
// );

// useEffect(() => {
// 	setTheme(
// 		responsiveFontSizes(
// 			createMuiTheme({
// 				palette: {
// 					type: themeType,
// 				},
// 			})
// 		)
// 	);
// }, [themeType]);

// useEffect(() => {
// 	setThemeType(prefersDarkMode ? "dark" : "light");
// }, [prefersDarkMode]);
