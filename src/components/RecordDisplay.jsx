import React, { useState, useEffect } from "react";

function RecordDisplay({ teamData }) {
  const teamsWithWinrates = teamData.map((team) => ({
    ...team,
    winrate: team.record.wins / (team.record.wins + team.record.losses),
  }));

  const sortedTeams = teamsWithWinrates.sort((a, b) => b.winrate - a.winrate);

  return (
    <div className="teams-container">
      {sortedTeams.map((team, index) => (
        <div key={index} className="team-box">
          <h3 className="team-name">
            <a
              href={`https://www.op.gg/multisearch/na?summoners=${team.players
                .map((player) => `${player.gameName}%23${player.tag}`)
                .join("%2C")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="team-link"
            >
              {team.teamName} (Seed: {team.seed})
            </a>
          </h3>
          <p className="team-info">
            Winrate: {`${(team.winrate * 100).toFixed(0)}%`} ({team.record.wins}{" "}
            - {team.record.losses})
          </p>
          {/* Render other team information as needed */}
        </div>
      ))}
    </div>
  );
}

export default RecordDisplay;
