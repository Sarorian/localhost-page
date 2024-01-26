import React, { useState, useEffect } from "react";
import common from "../../helpers/common";
import axios from "axios";
import AdminDisplay from "../../components/AdminDisplay";
import NukeButton from "../../components/NukeButton";
import POSemifinals from "../../components/POSemifinals";
import POFinals from "../../components/POFinals";
import PO3rdPlace from "../../components/PO3rdPlace";

const PlayoffBracket = ({ isAdmin, highlight }) => {
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

  const POSemifinalsData =
    bracketData &&
    bracketData.filter(
      (matchup) => matchup.stage === "Playoff" && matchup.round === "Semifinals"
    );

  const POFinalsData =
    bracketData &&
    bracketData.filter(
      (matchup) => matchup.stage === "Playoff" && matchup.round === "Finals"
    );

  const PO3rdPlaceData =
    bracketData &&
    bracketData.filter(
      (matchup) => matchup.stage === "Playoff" && matchup.round === "3rdPlace"
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
                if (stageChange === "PlayoffsFinals") {
                  axios.put(
                    `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${winner}/${stageChange}`
                  );
                  if (winner === blue) {
                    axios.put(
                      `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${red}/3rdPlace`
                    );
                  } else if (winner === red) {
                    axios.put(
                      `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${blue}/3rdPlace`
                    );
                  }
                } else if (stageChange === "Victor") {
                  axios.put(
                    `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${winner}/${stageChange}`
                  );
                  if (winner === blue) {
                    axios.put(
                      `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${red}/2ndPlace`
                    );
                  } else if (winner === red) {
                    axios.put(
                      `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${blue}/2ndPlace`
                    );
                  }
                } else if (stageChange === "3rdPlace") {
                  axios.put(
                    `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${winner}/${stageChange}`
                  );
                  if (winner === blue) {
                    axios.put(
                      `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${red}/4thPlace`
                    );
                  } else if (winner === red) {
                    axios.put(
                      `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${blue}/4thPlace`
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
          <div
            className="swiss-container"
            onMouseOver={(e) => highlight(e, "#A4A4A4")}
            onMouseOut={(e) => highlight(e, null)}
          >
            <div className="round semifinals">
              <h2 className="time-box">4:00 PM</h2>
              <POSemifinals
                POSemifinalsData={POSemifinalsData}
                teamData={teamData}
                isAdmin={isAdmin}
                updateMatchups={updateMatchups}
                updateWinner={updateWinner}
              />
            </div>
            <div className="round finals">
              <h2 className="time-box">5:00 PM</h2>
              <POFinals
                POFinalsData={POFinalsData}
                teamData={teamData}
                isAdmin={isAdmin}
                updateMatchups={updateMatchups}
                updateWinner={updateWinner}
              />
              <PO3rdPlace
                PO3rdPlaceData={PO3rdPlaceData}
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

export default PlayoffBracket;
