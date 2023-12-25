import { useReducer, useEffect, useRef } from "react";
import io from "socket.io-client";
import { ThemeProvider } from "@mui/material/styles";
import {
    Autocomplete,
    Button,
    Card,
    CardHeader,
    CardContent,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    TextField,
    Typography,
} from "@mui/material";
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import theme from "../theme";
import "../App.css";
import ChatMsg from "./chatmsg";

const Project2 = () => {
    const initialState = {
        socket: null,
        status: "",
        message: "",
        messages: [],
        userName: "",
        roomName: "",
        users: [],
        rooms: ["main"],
        showjoinfields: true,
        isTyping: false,
        typingMsg: "",
        dialogOpen: false,
    };
    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current) return; // React 18 Strictmode runs useEffects twice in development`
        serverConnect();
        effectRan.current = true;
    }, []);

    const serverConnect = () => {
        try {
            // connect to server locally
            // const socket = io.connect("localhost:5000", {
            //     forceNew: true,
            //     transports: ["websocket"],
            //     autoConnect: true,
            //     reconnection: false,
            //     timeout: 5000,
            // });
            const socket = io.connect();
            setState({ socket: socket });

            socket.on("nameexists", onExists);
            socket.on("welcome", addMessageToList);
            socket.on("someonejoined", addMessageToList);
            socket.on("someoneleft", addMessageToList);
            socket.on("someoneistyping", onTyping);
            socket.on("newmessage", onNewMessage);
            socket.on("onlinechange", onOnlineChange)
        } catch (err) {
            console.log(err);
            setState({ status: "some other problem occurred" });
        }
    };


    const onExists = (msg) => {
        setState({ status: msg });
    };

    const addMessageToList = (msg) => {
        let messages = state.messages; // declared earlier in reducer or state hook
        messages.push(msg);
        setState({
            messages: messages,
            showjoinfields: false,
            // set any other state variables for the reducer go here
        });
    };

    const onNewMessage = (msg) => {
        addMessageToList(msg);
        setState({ typingMsg: "" });
    };

    const onOnlineChange = (users) => {
        let r = [...new Set(users.map(user => user.roomName))];
        if (!r.includes("Main"))
            r.push("Main");
        setState({ users: users, rooms: r });
    };

    const onTyping = (msg) => {
        if (msg.senderName !== state.userName) {
            setState({
                typingMsg: msg
            });
        }
    };

    const onNameChange = (e) => {
        setState({ userName: e.target.value, status: "" });
    };

    const onRoomChange = (e, value) => {
        setState({ roomName: value });
    };

    // keypress handler for message TextField
    const onMessageChange = (e) => {
        setState({ message: e.target.value });
        if (state.isTyping === false) {
            state.socket.emit("typing", {
                userName: state.userName,
                roomName: state.roomName,
            });
            setState({ isTyping: true }); // flag first byte only
        }
    };

    // enter key handler to send message
    const handleSendMessage = (e) => {
        if (state.message !== "") {
            state.socket.emit("message", {
                userName: state.userName,
                roomName: state.roomName,
                text: state.message,
            });
            setState({ isTyping: false, message: "" });
        }
    };

    const handleJoin = () => {
        state.socket.emit("join", {
            userName: state.userName,
            roomName: state.roomName,
        });
    };

    const handleOpenDialog = () => setState({ dialogOpen: true });
    const handleCloseDialog = () => setState({ dialogOpen: false });

    return (
        <ThemeProvider theme={theme}>
            <Card>
                <CardHeader
                    title="ChatApp"
                    style={{ backgroundColor: theme.palette.primary.main, color: "white", textAlign: "center" }}
                    action={!state.showjoinfields && (
                        <IconButton onClick={handleOpenDialog}>
                            <GroupsIcon style={{ color: "white", height: 50, width: 50 }} />
                        </IconButton>
                    )}
                />
                <CardContent>
                    {state.showjoinfields ? (
                        <>

                            <div style={{ textAlign: 'center', fontSize: "30px", fontWeight: "bold" }}>
                                <QuestionAnswerIcon style={{ color: theme.palette.secondary.main, height: 60, width: 60 }} />
                                <p></p>
                                Sign In
                            </div>
                            <p></p>
                            <div>
                                <TextField
                                    onChange={onNameChange}
                                    fullWidth
                                    label="Enter Unique Username"
                                    autoFocus={true}
                                    required
                                    value={state.userName}
                                    error={state.status !== ""}
                                    helperText={state.status} />
                            </div>
                            <p></p>
                            <div>
                                <Autocomplete
                                    freeSolo
                                    options={state.rooms}
                                    onInputChange={onRoomChange}
                                    renderInput={(params) => <TextField {...params} required label="Choose or Enter Room Name" />}
                                />
                            </div>
                            <p></p>
                            <div>
                                <Button
                                    variant="contained"
                                    data-testid="submit"
                                    color="secondary"
                                    onClick={() => handleJoin()}
                                    disabled={state.userName === "" || state.roomName === ""} >
                                    Join
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1>Chatting in {state.roomName}</h1>
                            <div>
                                <List className="usersList">
                                    {state.messages.map((message, index) => (
                                        <ChatMsg msg={message} key={index} self={state.userName} />
                                    ))}
                                </List>
                            </div>
                            <div>
                                <Typography className="blink">
                                    {state.typingMsg.text}
                                </Typography>
                            </div>
                            <TextField
                                style={{ width: "100%" }}
                                onChange={onMessageChange}
                                placeholder="Write a message..."
                                autoFocus={true}
                                value={state.message}
                                multiline={true}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        handleSendMessage();
                                        e.target.blur();
                                    }
                                }}
                            />
                            <Dialog open={state.dialogOpen} onClose={handleCloseDialog} style={{ margin: 20 }}>
                                <DialogTitle style={{ textAlign: "center", fontWeight: "bold" }}>
                                    Users Online
                                </DialogTitle>
                                {state.users.map(user => (
                                    <DialogContent key={user.id} style={{ minHeight: "15vh", minWidth: "15vw", textAlign: "center", fontSize: "20px" }}><PersonIcon style={{ verticalAlign: "middle", color: user.color, marginRight: "1vw", backgroundColor: "lightgrey", borderRadius: "15%" }} />{user.userName} is in room {user.roomName}</DialogContent>
                                ))}
                            </Dialog>
                        </>
                    )}
                </CardContent>
            </Card>
        </ThemeProvider>
    );
}

export default Project2;