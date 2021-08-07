import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
	createMuiTheme,
	responsiveFontSizes,
	ThemeProvider,
} from "@material-ui/core/styles";
import { useEffect, useMemo } from "react";

const ThemeController = (props) => {
	console.log("ThemeController.PROPS:");
	console.log(props);
	const { darkMode, setDarkMode } = props;
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
	// const [themeType, setThemeType] = useState(
	// 	darkMode ? "dark" : "light"
	// );
	// const defaultTheme = responsiveFontSizes(
	// 	createMuiTheme({
	// 		typography: {
	// 			h1: {
	// 				fontSize: "3.75rem",
	// 			},
	// 			h2: {
	// 				fontSize: "3rem",
	// 			},
	// 			h3: {
	// 				fontSize: "2.375rem",
	// 			},
	// 			h4: {
	// 				fontSize: "1.875rem",
	// 			},
	// 			h5: {
	// 				fontSize: "1.5rem",
	// 			},
	// 			h6: {
	// 				fontSize: "1.25rem",
	// 			},
	// 		},
	// 	})
	// );
	// const [theme, setTheme] = useState(defaultTheme);
	// useEffect(() => {
	// 	const temp = { ...theme };
	// 	console.log("ThemeProvider.TEMP:");
	// 	console.log(temp);
	// 	temp.palette.type = darkMode ? "dark" : "light";
	// 	console.log(temp);
	// 	setTheme(temp);
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [darkMode]);

	useEffect(() => {
		if (setDarkMode) setDarkMode(prefersDarkMode);
	}, [prefersDarkMode, setDarkMode]);

	const theme = useMemo(
		() =>
			responsiveFontSizes(
				createMuiTheme({
					palette: {
						primary: {
							main: "#7986cb",
						},
						type: darkMode ? "dark" : "light",
						contrastThreshold: 3,
						tonalOffset: 0.3,
					},
					typography: {
						h1: {
							fontSize: "3.75rem",
						},
						h2: {
							fontSize: "3rem",
						},
						h3: {
							fontSize: "2.375rem",
						},
						h4: {
							fontSize: "1.875rem",
						},
						h5: {
							fontSize: "1.5rem",
						},
						h6: {
							fontSize: "1.25rem",
						},
					},
				})
			),
		[darkMode]
	);

	return (
		<>
			{!theme && <ThemeProvider>{props.children}</ThemeProvider>}
			{theme && (
				<ThemeProvider theme={theme}>{props.children}</ThemeProvider>
			)}
		</>
	);
};

export default ThemeController;
