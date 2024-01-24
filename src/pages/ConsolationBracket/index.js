import React, { useState, useEffect } from "react";
import common from "../../helpers/common";
import axios from "axios";
import AdminDisplay from "../../components/AdminDisplay";
import NukeButton from "../../components/NukeButton";
import COSemifinals from "../../components/COSemifinals";
import COFinals from "../../components/COFinals.jsx";
import CO3rdPlace from "../../components/CO3rdPlace";
import COQuarterfinals from "../../components/COQuarterfinals.jsx";

const ConsolationBracket = ({ isAdmin }) => {
  const [stateVal, setStateVal] = useState({
    bracketData: null,
    teamData: null,
    loading: true,
  });

  const { bracketData, loading, teamData } = stateVal;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: bracketData } = await axios.get(
          "https://localhost-api-1c3554ca2868.herokuapp.com/games"
        );
        const { data: teamData } = await axios.get(
          "https://localhost-api-1c3554ca2868.herokuapp.com/teams"
        );
        setStateVal((prev) => ({
          ...prev,
          bracketData: bracketData,
          teamData: teamData,
          loading: false,
        }));
      } catch (error) {
        common.displayMessage("error", "Error displaying data");
      }
    };
    fetchData();
  }, [loading]);

  const COQuarterfinalsData =
    bracketData &&
    bracketData.filter(
      (matchup) =>
        matchup.stage === "Consolation" && matchup.round === "Quarterfinals"
    );

  const COSemifinalsData =
    bracketData &&
    bracketData.filter(
      (matchup) =>
        matchup.stage === "Consolation" && matchup.round === "Semifinals"
    );

  const COFinalsData =
    bracketData &&
    bracketData.filter(
      (matchup) => matchup.stage === "Consolation" && matchup.round === "Finals"
    );

  const CO3rdPlaceData =
    bracketData &&
    bracketData.filter(
      (matchup) =>
        matchup.stage === "Consolation" && matchup.round === "3rdPlace"
    );

  const updateResults = (winner, blue, red) => {
    const winnerURL = `https://localhost-api-1c3554ca2868.herokuapp.com/giveWin/${winner}`;
    const loserURL = `https://localhost-api-1c3554ca2868.herokuapp.com/giveLoss/`;

    axios.put(winnerURL);
    axios.put(`${loserURL}${winner === blue ? red : blue}`);
  };

  const updateWinner = async (matchups, stage, round, stageChange) => {
    try {
      const filteredBracketGames = bracketData.filter((game) => {
        return game.stage === stage && game.round === round;
      });
      matchups.forEach((matchup, index) => {
        const { blue, red, winner } = matchup;
        if (filteredBracketGames[index].winner?.teamName === winner) {
          return;
        } else if (winner === "") {
          return;
        } else if (winner !== blue && winner !== red) {
          common.displayMessage(
            "error",
            `Invalid winner for ${stage} ${round} game ${index + 1}`
          );
        } else {
          const endpoint = `https://localhost-api-1c3554ca2868.herokuapp.com/update/winner/${stage}/${round}/${
            index + 1
          }/${winner}`;
          axios
            .put(endpoint)
            .then((response) => {
              if (response.status === 200) {
                common.displayMessage(
                  "success",
                  `Updated Winner for ${stage} ${round} game ${index + 1}`
                );
                console.log("Updaing winner");
                setStateVal((prev) => ({
                  ...prev,
                  loading: true,
                }));
                if (stageChange === "ConsolationFinals") {
                  axios.put(
                    `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${winner}/${stageChange}`
                  );
                  if (winner === blue) {
                    axios.put(
                      `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${red}/CO3rdPlace`
                    );
                  } else if (winner === red) {
                    axios.put(
                      `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${blue}/CO3rdPlace`
                    );
                  }
                } else if (stageChange === "ConsolationVictor") {
                  axios.put(
                    `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${winner}/${stageChange}`
                  );
                  if (winner === blue) {
                    axios.put(
                      `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${red}/CO2ndPlace`
                    );
                  } else if (winner === red) {
                    axios.put(
                      `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${blue}/CO2ndPlace`
                    );
                  }
                } else if (stageChange === "CO3rdPlace") {
                  axios.put(
                    `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${winner}/${stageChange}`
                  );
                  if (winner === blue) {
                    axios.put(
                      `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${red}/CO4thPlace`
                    );
                  } else if (winner === red) {
                    axios.put(
                      `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${blue}/CO4thPlace`
                    );
                  }
                } else if (stageChange === "ConsolationSemifinals") {
                  axios.put(
                    `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${winner}/${stageChange}`
                  );
                  if (winner === blue) {
                    axios.put(
                      `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${red}/Out`
                    );
                  } else if (winner === red) {
                    axios.put(
                      `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${blue}/Out`
                    );
                  }
                }
              } else {
                common.displayMessage("error", "Failed to update match");
              }
            })
            .catch((error) => {
              console.error("Error updating match:", error.message);
              common.displayMessage("error", "Error updating match");
            });
          if (winner === blue || winner === red) {
            updateResults(winner, blue, red);
          }
        }
      });
    } catch (error) {
      console.error("Error updating matches:", error.message);
      common.displayMessage("error", "Error updating matches");
    }
  };

  const DUPLICATE_MATCH = "Duplicates";

  const updateMatchups = async (matchups, stage, round) => {
    try {
      const filteredBracketGames = bracketData.filter((game) => {
        return game.stage === stage && game.round === round;
      });
      const allTeams = matchups.reduce((acc, cur) => {
        if (cur.red !== "") acc.push(cur.red);
        if (cur.blue !== "") acc.push(cur.blue);
        return acc;
      }, []);
      const uniqueAllTeams = [...new Set(allTeams)];
      if (allTeams.length !== uniqueAllTeams.length) {
        throw Error(DUPLICATE_MATCH);
      }
      matchups.forEach((matchup, index) => {
        const { blue, red } = matchup;
        if (
          blue === filteredBracketGames[index].teams.blue?.teamName &&
          red === filteredBracketGames[index].teams.red?.teamName
        ) {
          return;
        }
        if (blue !== "" && red !== "") {
          const endpoint = `https://localhost-api-1c3554ca2868.herokuapp.com/update/game/${stage}/${round}/${
            index + 1
          }/${blue}/${red}`;
          axios
            .put(endpoint)
            .then((response) => {
              if (response.status === 200) {
                common.displayMessage(
                  "success",
                  `Updated Match ${stage} ${round} game ${index + 1}`
                );
                console.log("Updaing matchup");
                setStateVal((prev) => ({
                  ...prev,
                  loading: true,
                }));
              } else {
                common.displayMessage("error", "Failed to update match");
              }
            })
            .catch((error) => {
              console.error("Error updating match:", error.message);
              common.displayMessage(
                "error",
                error.message === DUPLICATE_MATCH
                  ? DUPLICATE_MATCH
                  : "Error updating match"
              );
            });
        }
      });
    } catch (error) {
      console.error("Error updating matches:", error.message);
      common.displayMessage(
        "error",
        error.message === DUPLICATE_MATCH
          ? DUPLICATE_MATCH
          : "Error updating match"
      );
    }
  };

  const resetBracket = () => {
    try {
      const resetRecord = (team) => {
        const teamName = team.teamName;
        const wins = team.record.wins;
        const losses = team.record.losses;
        axios.put(
          `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${teamName}/Swiss`
        );
        axios.put(
          `https://localhost-api-1c3554ca2868.herokuapp.com/takeWins/${teamName}/${wins}`
        );
        axios.put(
          `https://localhost-api-1c3554ca2868.herokuapp.com/takeLosses/${teamName}/${losses}`
        );
      };
      teamData.forEach((team) => {
        resetRecord(team);
      });
      setStateVal((prev) => ({
        ...prev,
        loading: true,
      }));
      axios.put(`https://localhost-api-1c3554ca2868.herokuapp.com/resetGames`);
      common.displayMessage("success", `Tournament Reset`);
    } catch (error) {
      console.error("Error updating matches:", error.message);
      common.displayMessage("error", "Error updating matches");
    }
  };

  return (
    <>
      {loading ? (
        <div className="dot-pulse"></div>
      ) : (
        <div>
          {isAdmin && <AdminDisplay />}
          <div className="swiss-container">
            <div className="round quarterfinals">
              <h2 className="time-box">4:00 PM</h2>
              <COQuarterfinals
                COQuarterfinalsData={COQuarterfinalsData}
                teamData={teamData}
                isAdmin={isAdmin}
                updateMatchups={updateMatchups}
                updateWinner={updateWinner}
              />
            </div>
            <div className="round semifinals">
              <h2 className="time-box">5:00 PM</h2>
              <COSemifinals
                COSemifinalsData={COSemifinalsData}
                teamData={teamData}
                isAdmin={isAdmin}
                updateMatchups={updateMatchups}
                updateWinner={updateWinner}
              />
            </div>
            <div className="round finals">
              <h2 className="time-box">6:00 PM</h2>
              <COFinals
                COFinalsData={COFinalsData}
                teamData={teamData}
                isAdmin={isAdmin}
                updateMatchups={updateMatchups}
                updateWinner={updateWinner}
              />
              <CO3rdPlace
                CO3rdPlaceData={CO3rdPlaceData}
                teamData={teamData}
                isAdmin={isAdmin}
                updateMatchups={updateMatchups}
                updateWinner={updateWinner}
              />
            </div>
          </div>

          {isAdmin && <NukeButton resetBracket={resetBracket} />}
        </div>
      )}
    </>
  );
};

export default ConsolationBracket;
