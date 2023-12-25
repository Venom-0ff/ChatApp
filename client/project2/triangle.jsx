const Triangle = (props) => {
    if (props.msg.senderName == props.self) {
        return (
            <div
                style={{
                    content: "" /* triangle */,
                    position: "absolute",
                    bottom: "-1.0vh" /* value = - border-top-width - border-bottom-width */,
                    right: "-1vh" /* value = - border-top-width - border-bottom-width */,
                    borderWidth:
                        "20px 30px 0" /* vary these values to change the angle of the vertex */,
                    borderStyle: "solid",
                    borderColor: `${props.msg.color} transparent`,
                    transform: "rotate(0.5turn)",
                }}
            />
        );
    }
    else {
        return (
            <div
                style={{
                    content: "" /* triangle */,
                    position: "absolute",
                    bottom: "-1.0vh" /* value = - border-top-width - border-bottom-width */,
                    left: "-1vh" /* value = - border-top-width - border-bottom-width */,
                    borderWidth:
                        "20px 30px 0" /* vary these values to change the angle of the vertex */,
                    borderStyle: "solid",
                    borderColor: `${props.msg.color} transparent`,
                    transform: "rotate(0.5turn)",
                }}
            />
        );
    }
};
export default Triangle;