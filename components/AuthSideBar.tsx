const AuthSideBar = () => {
  const boxStyle = "border flex flex-col p-4 rounded-md bg-card border-border";
  return (
    <div className="flex flex-col gap-5 font-hanken">
      <h1 className="text-primary text-4xl font-bold">Beacon</h1>
      <h3 className="font-semibold text-2xl">Real-time incident response built for teams</h3>
      <h4 className="text-muted-foreground">
        Live incident timelines, shared notes, and real-time coordination for the moments when speed actually matters.
      </h4>
      <div className="flex gap-4">
        <div className={boxStyle}>
          <span className="font-semibold">Live Timelines</span>
          <span className="text-sm text-muted-foreground">Track every action, as it happens.</span>
        </div>
        <div className={boxStyle}>
          <span className="font-semibold">Shared Incident Space</span>
          <span className="text-sm text-muted-foreground">Coordinate with your team in real time</span>
        </div>
      </div>
    </div>
  );
};

export default AuthSideBar;