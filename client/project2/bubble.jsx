import "../App.css";

const Bubble = (props) => {
    return (
        <div className="userBubble" style={{ backgroundColor: props.msg.color }}>
            <div style={{ fontWeight: "bold", fontSize: "larger" }}>{props.msg.senderName}:</div>
            <div style={{ overflowWrap: "break-word" }}>{props.msg.text}</div>
            <p></p>
            <div style={{ textAlign: "right", fontSize: "smaller", color: "lightgrey" }}>{props.msg.time}</div>
        </div>
    );

};

export default Bubble;