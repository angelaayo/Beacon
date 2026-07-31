import React from "react";

const SignUpSideBar = () => {
  const boxStyle =
    "border-1 flex flex-col p-4 rounded-md bg-[#F9F9F9] border-[#657D6A]";
  return (
    <div className="flex flex-col gap-5 font-hanken">
      <h1 className="text-[#4C6452] text-4xl font-bold">Beacon</h1>
      <h3 className="font-semibold text-2xl ">
        Real-time incident response built for teams
      </h3>
      <h4>
        Live incident timelines, shared notes, and real-time coordination for
        the moments when speed actually matters.
      </h4>
      <div className="flex gap-4">
        <div className={boxStyle}>
          <span className="font-semibold">Live Timelines</span>
          <span>Track every action, as it happens.</span>
        </div>
        <div className={boxStyle}>
          <span className="font-semibold">Shared Incident Space</span>
          <span>Coordinate with your team in real time</span>
        </div>
      </div>
    </div>
  );
};

export default SignUpSideBar;
