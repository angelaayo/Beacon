import React from "react";

const StatsCard = (props) => {
  return (
    <div className="border">
      <h5>{props.label}</h5>
      <h2>{props.value}</h2>
    </div>
  );
};

export default StatsCard;
