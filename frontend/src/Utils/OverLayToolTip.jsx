import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const OverLayToolTip = ({ icon, tooltip, onClick, style }) => {
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip
          style={{ overflow: "hidden" }}
          className="border border-2 p-0 rounded-2"
          id="button-tooltip"
        >
          {tooltip}
        </Tooltip>
      }
    >
      <button style={style} onClick={onClick} className="btn">
        {icon}
      </button>
    </OverlayTrigger>
  );
};

export default OverLayToolTip;
