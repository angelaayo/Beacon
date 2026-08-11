"use client";
import React, { useState } from "react";
import IncidentOverview from "./IncidentOverview";
import IncidentNotebook from "./IncidentNotebook";
import { getIncident } from "@/lib/queries/incedentQueries";
import { verifyToken } from "@/lib/auth/jwt";

type Incident = NonNullable<Awaited<ReturnType<typeof getIncident>>>;
type User = NonNullable<Awaited<ReturnType<typeof verifyToken>>>;
type Props = {
  incident: Incident;
  user: User;
};

const IncidentBody = ({ incident, user }: Props) => {
  const [overview, setOverview] = useState(true);
  const clickedStyle =
    "bg-primary text-primary-foreground font-semibold px-8 py-1.5 rounded-md text-sm";
  const notClickedStyle =
    "bg-card border px-8 py-1.5 font-semibold text-muted-foreground rounded-md text-sm hover:text-foreground transition-colors";
  return (
    <div>
      <div className="flex gap-4 px-3 font-hanken text-sm justify-center md:justify-start">
        <button
          type="button"
          onClick={() => setOverview(true)}
          className={overview ? clickedStyle : notClickedStyle}
        >
          OVERVIEW
        </button>
        <button
          type="button"
          onClick={() => setOverview(false)}
          className={!overview ? clickedStyle : notClickedStyle}
        >
          NOTEBOOK
        </button>
      </div>
      {overview ? (
        <IncidentOverview incident={incident} user={user} />
      ) : (
        <IncidentNotebook />
      )}
    </div>
  );
};

export default IncidentBody;
