import React from "react";

function NukeButton({ resetBracket }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "10px",
        marginTop: "50em",
      }}
    >
      <div
        style={{
          padding: "10px",
          backgroundColor: "red",
        }}
      >
        <button
          onClick={() => {
            resetBracket();
          }}
        >
          RESET BRACKET
        </button>
      </div>
    </div>
  );
}

export default NukeButton;
