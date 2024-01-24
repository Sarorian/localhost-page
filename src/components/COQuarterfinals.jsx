import React, { useState, useEffect } from "react";

function COQuarterfinals({
  COQuarterfinalsData,
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
    { blue: "", red: "", winner: "" },
    { blue: "", red: "", winner: "" },
  ]);

  const [selectableTeams, setSelectableTeams] = useState([]);

  useEffect(() => {
    const updateData = () => {
      setNewMatchups(() => {
        return COQuarterfinalsData.map((matchup) => ({
          blue: matchup.teams.blue ? matchup.teams.blue.teamName || "" : "",
          red: matchup.teams.red ? matchup.teams.red.teamName || "" : "",
          winner: matchup.winner ? matchup.winner.teamName || "" : "",
        }));
      });
      const teamsToSet = teamData.filter(
        (team) => team.stage === "consolation" || team.stage === "Swiss"
      );

      setSelectableTeams(teamsToSet);
    };
    updateData();
  }, [COQuarterfinalsData, teamData]);

  const handleBlueTeamChange = (index, teamId) => {
    setNewMatchups((prev) => {
      const updatedMatchups = [...prev];
      if (!updatedMatchups[index]) {
        updatedMatchups[index] = {};
      }
      updatedMatchups[index] = { ...updatedMatchups[index], blue: teamId };

      if (teamId === "") {
        updatedMatchups[index] = { ...updatedMatchups[index], red: "" };
      }

      return updatedMatchups;
    });
  };

  const handleRedTeamChange = (index, teamId) => {
    console.log("changing red team for game " + index);
    setNewMatchups((prev) => {
      const updatedMatchups = [...prev];
      if (!updatedMatchups[index]) {
        updatedMatchups[index] = {};
      }
      updatedMatchups[index] = { ...updatedMatchups[index], red: teamId };
      if (teamId === "") {
        updatedMatchups[index] = { ...updatedMatchups[index], blue: "" };
      }

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

  console.log(teamData);

  return (
    <table className="bracket-table">
      <thead>
        <tr>
          <th colSpan="3" style={{ textAlign: "center" }}>
            <h2 className="round-name">Quarterfinals</h2>
          </th>
        </tr>
        <tr>
          <th style={{ textAlign: "center" }}>Blue</th>
          <th style={{ textAlign: "center" }}>Red</th>
        </tr>
      </thead>
      <tbody>
        {COQuarterfinalsData &&
          COQuarterfinalsData.map((matchup, index) => (
            <tr key={index} className="matchup-row">
              <td
                className={
                  matchup.winner?.teamName &&
                  matchup.winner?.teamName === matchup.teams.blue?.teamName
                    ? "winner-row"
                    : ""
                }
                style={{
                  textAlign: "center",
                }}
              >
                {isAdmin ? (
                  <>
                    {matchup.winner ? (
                      // Display static text if winner is selected
                      <span>{matchup.teams.blue?.teamName || "TBD"}</span>
                    ) : (
                      // Display dropdown if winner is not selected
                      <select
                        value={newMatchups[index].blue}
                        onChange={(e) =>
                          handleBlueTeamChange(index, e.target.value)
                        }
                      >
                        <option value="">Select Team</option>
                        {selectableTeams.map((team) => (
                          <option key={team._id} value={team._id}>
                            {team.teamName}
                          </option>
                        ))}
                      </select>
                    )}
                  </>
                ) : matchup.teams.blue ? (
                  matchup.teams.blue.teamName
                ) : (
                  "TBD"
                )}
              </td>
              <td
                className={
                  matchup.winner?.teamName &&
                  matchup.winner?.teamName === matchup.teams.red?.teamName
                    ? "winner-row"
                    : ""
                }
                style={{
                  textAlign: "center",
                }}
              >
                {isAdmin ? (
                  <>
                    {matchup.winner ? (
                      // Display static text if winner is selected
                      <span>{matchup.teams.red?.teamName || "TBD"}</span>
                    ) : (
                      // Display dropdown if winner is not selected
                      <select
                        value={newMatchups[index].red}
                        onChange={(e) =>
                          handleRedTeamChange(index, e.target.value)
                        }
                      >
                        <option value="">Select Team</option>
                        {selectableTeams.map((team) => (
                          <option key={team._id} value={team._id}>
                            {team.teamName}
                          </option>
                        ))}
                      </select>
                    )}
                  </>
                ) : matchup.teams.red ? (
                  matchup.teams.red.teamName
                ) : (
                  "TBD"
                )}
              </td>
              {isAdmin && (
                <td style={{ textAlign: "center" }}>
                  {matchup.winner ? (
                    // Display static text if winner is selected
                    <span>{matchup.winner.teamName}</span>
                  ) : (
                    // Display dropdown if winner is not selected
                    <select
                      value={newMatchups[index].winner}
                      onChange={(e) =>
                        handleWinnerChange(index, e.target.value)
                      }
                    >
                      <option value="">Select Winner</option>
                      <option value={newMatchups[index].blue}>
                        {newMatchups[index].blue}
                      </option>
                      <option value={newMatchups[index].red}>
                        {newMatchups[index].red}
                      </option>
                    </select>
                  )}
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
                    updateMatchups(newMatchups, "Consolation", "Quarterfinals");
                    updateWinner(
                      newMatchups,
                      "Consolation",
                      "Quarterfinals",
                      "ConsolationSemifinals"
                    );
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

export default COQuarterfinals;
