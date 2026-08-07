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
    "bg-[#003825] text-white font-semibold px-8 py-1 rounded-md";
  const notClickedStyle =
    "bg-[#FFFFFF] px-8 py-1 border-4 font-semibold text-gray-600 rounded-md";
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
