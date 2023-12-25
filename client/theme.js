import { createTheme } from "@mui/material/styles";

export default createTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        "common": {
            "black": "#000",
            "white": "rgba(255, 255, 255, 1)"
        },
        "background": {
            "paper": "rgba(255, 255, 255, 1)",
            "default": "#fafafa"
        },
        "primary": {
            "light": "rgba(79, 162, 255, 1)",
            "main": "rgba(20, 131, 255, 1)",
            "dark": "rgba(0, 102, 216, 1)",
            "contrastText": "#fff"
        },
        "secondary": {
            "light": "rgba(255, 172, 79, 1)",
            "main": "rgba(255, 144, 20, 1)",
            "dark": "rgba(216, 114, 0, 1)",
            "contrastText": "#fff"
        },
        "error": {
            "light": "rgba(255, 59, 59, 1)",
            "main": "rgba(255, 0, 0, 1)",
            "dark": "rgba(196, 0, 0, 1)",
            "contrastText": "#fff"
        },
        "text": {
            "primary": "rgba(0, 0, 0, 0.87)",
            "secondary": "rgba(0, 0, 0, 0.54)",
            "disabled": "rgba(0, 0, 0, 0.38)",
            "hint": "rgba(0, 0, 0, 0.38)"
        }
    }
});