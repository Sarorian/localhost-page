import React, { useState, useEffect } from "react";

function Swiss00({ swiss00Data, teamData, isAdmin, updateMatchups }) {
  const [newMatchups, setNewMatchups] = useState([
    { blue: "", red: "", winner: "" },
    { blue: "", red: "", winner: "" },
    { blue: "", red: "", winner: "" },
    { blue: "", red: "", winner: "" },
    { blue: "", red: "", winner: "" },
    { blue: "", red: "", winner: "" },
    { blue: "", red: "", winner: "" },
    { blue: "", red: "", winner: "" },
  ]);

  useEffect(() => {
    const updateData = () => {
      setNewMatchups(() => {
        return swiss00Data.map((matchup) => ({
          blue: matchup.teams.blue ? matchup.teams.blue.teamName || "" : "",
          red: matchup.teams.red ? matchup.teams.red.teamName || "" : "",
          winner: matchup.winner ? matchup.winner.teamName || "" : "",
        }));
      });
    };
    updateData();
  }, [swiss00Data]);

  const teamsWithZeroWinsAndLosses = teamData.filter(
    (team) => team.record.wins === 0 && team.record.losses === 0
  );

  const handleBlueTeamChange = (index, teamId) => {
    setNewMatchups((prev) => {
      const updatedMatchups = [...prev];
      if (!updatedMatchups[index]) {
        updatedMatchups[index] = {};
      }
      updatedMatchups[index] = { ...updatedMatchups[index], blue: teamId };
      return updatedMatchups;
    });
  };

  const handleRedTeamChange = (index, teamId) => {
    setNewMatchups((prev) => {
      const updatedMatchups = [...prev];
      if (!updatedMatchups[index]) {
        updatedMatchups[index] = {};
      }
      updatedMatchups[index] = { ...updatedMatchups[index], red: teamId };
      return updatedMatchups;
    });
  };

  const handleWinnerChange = (index, team) => {
    setNewMatchups((prev) => {
      const updatedMatchups = [...prev];
      updatedMatchups[index] = { ...updatedMatchups[index], winner: team };
      return updatedMatchups;
    });
  };

  return (
    <table className="bracket-table">
      <thead>
        <tr>
          <th>Round 0-0</th>
        </tr>
      </thead>
      <tbody>
        {swiss00Data &&
          swiss00Data.map((matchup, index) => (
            <tr key={index} className="matchup-row">
              <td>
                {isAdmin ? (
                  <>
                    <span style={{ paddingRight: "5px" }}>
                      Game {matchup.game}
                    </span>
                    <select
                      value={newMatchups[index].blue}
                      onChange={(e) =>
                        handleBlueTeamChange(index, e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Select Team
                      </option>
                      {teamsWithZeroWinsAndLosses.map((team) => (
                        <option key={team._id} value={team._id}>
                          {team.teamName}
                        </option>
                      ))}
                    </select>
                  </>
                ) : matchup.teams.blue ? (
                  matchup.teams.blue.teamName
                ) : (
                  "TBD"
                )}
              </td>
              <td>
                {isAdmin ? (
                  <select
                    value={newMatchups[index].red}
                    onChange={(e) => handleRedTeamChange(index, e.target.value)}
                  >
                    <option value="" disabled>
                      Select Team
                    </option>
                    {teamsWithZeroWinsAndLosses.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.teamName}
                      </option>
                    ))}
                  </select>
                ) : matchup.teams.red ? (
                  matchup.teams.red.teamName
                ) : (
                  "TBD"
                )}
              </td>
              {isAdmin && (
                <td>
                  <select
                    value={newMatchups[index].winner}
                    onChange={(e) => handleWinnerChange(index, e.target.value)}
                  >
                    <option value="">Select Winner</option>
                    <option value={newMatchups[index].blue}>
                      {newMatchups[index].blue}
                    </option>
                    <option value={newMatchups[index].red}>
                      {newMatchups[index].red}
                    </option>
                  </select>
                </td>
              )}
            </tr>
          ))}
      </tbody>
      {isAdmin && (
        <>
          <button
            onClick={() => {
              updateMatchups(newMatchups, "Swiss", "0-0");
            }}
          >
            Update
          </button>
        </>
      )}
    </table>
  );
}

export default Swiss00;
