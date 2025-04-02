import React from "react";

function Separator(props) {
  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        transform: `rotate(${props.turns}turn)`
      }}
    >
      <div style={props.style} />
    </div>
  );
}

function RadialSeparators(props) {
  const turns = 1 / props.count;
  return [...Array(props.count).keys()].map(index => (
    <Separator turns={index * turns -0.35} style={props.style} />
  ));
}

export default RadialSeparators;
