import React, { useState, useEffect } from "react";

function Swiss01({
  swiss01Data,
  teamData,
  isAdmin,
  updateMatchups,
  updateWinner,
}) {
  const [newMatchups, setNewMatchups] = useState([
    { blue: "", red: "", winner: "" },
    { blue: "", red: "", winner: "" },
    { blue: "", red: "", winner: "" },
    { blue: "", red: "", winner: "" },
  ]);

  useEffect(() => {
    const updateData = () => {
      setNewMatchups(() => {
        return swiss01Data.map((matchup) => ({
          blue: matchup.teams.blue ? matchup.teams.blue.teamName || "" : "",
          red: matchup.teams.red ? matchup.teams.red.teamName || "" : "",
          winner: matchup.winner ? matchup.winner.teamName || "" : "",
        }));
      });
    };
    updateData();
  }, [swiss01Data]);

  const teamsWithZeroWinsAndOneLoss = teamData.filter(
    (team) => team.record.wins === 0 && team.record.losses === 1
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
          <th colSpan="3" style={{ textAlign: "center" }}>
            <h2>Round 0-1</h2>
          </th>
        </tr>
        <tr>
          <th style={{ textAlign: "center" }}>Blue</th>
          <th style={{ textAlign: "center" }}>Red</th>
        </tr>
      </thead>
      <tbody>
        {swiss01Data &&
          swiss01Data.map((matchup, index) => (
            <tr key={index} className="matchup-row">
              <td
                style={{
                  textAlign: "center",
                  backgroundColor:
                    matchup.winner?.teamName &&
                    matchup.winner?.teamName === matchup.teams.blue?.teamName
                      ? "green"
                      : "",
                }}
              >
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
                      {teamsWithZeroWinsAndOneLoss.map((team) => (
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
              <td
                style={{
                  textAlign: "center",
                  backgroundColor:
                    matchup.winner?.teamName &&
                    matchup.winner?.teamName === matchup.teams.red?.teamName
                      ? "green"
                      : "",
                }}
              >
                {isAdmin ? (
                  <select
                    value={newMatchups[index].red}
                    onChange={(e) => handleRedTeamChange(index, e.target.value)}
                  >
                    <option value="" disabled>
                      Select Team
                    </option>
                    {teamsWithZeroWinsAndOneLoss.map((team) => (
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
                <td style={{ textAlign: "center" }}>
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
          <tfoot>
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                <button
                  onClick={() => {
                    updateMatchups(newMatchups, "Swiss", "0-1");
                    updateWinner(newMatchups, "Swiss", "0-1");
                  }}
                >
                  Update
                </button>
              </td>
            </tr>
          </tfoot>
        </>
      )}
    </table>
  );
}

export default Swiss01;
