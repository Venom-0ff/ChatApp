import { useEffect, useRef } from "react";
import { ListItem } from "@mui/material";
import Bubble from "./bubble";
import Triangle from "./triangle";
import React from "react";
import "../App.css";

const ChatMsg = (props) => {
    const userRef = useRef(null);

    useEffect(() => {
        userRef.current.scrollIntoView(true);
    }, []);

    if (props.msg.senderName == props.self) {
        return (
            <div style={{ alignSelf: "end", marginRight: "2vw" }}>
                <ListItem
                    ref={userRef}
                    style={{ textAlign: "left", marginBottom: "1vh" }}
                >
                    <Triangle msg={props.msg} self={props.self} />
                    <Bubble msg={props.msg} self={props.self} color={props.msg.color} />
                </ListItem>
            </div>
        );
    }
    else {
        return (
            <div style={{ alignSelf: "start", marginLeft: "2vw" }}>
                <ListItem
                    ref={userRef}
                    style={{ textAlign: "left", marginBottom: "1vh" }}
                >
                    <Triangle msg={props.msg} self={props.self} />
                    <Bubble msg={props.msg} self={props.self} color={props.msg.color} />
                </ListItem>
            </div>
        );
    }
};

export default ChatMsg;