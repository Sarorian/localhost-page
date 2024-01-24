import React, { useState, useEffect } from "react";
import common from "../../helpers/common";
import axios from "axios";
import Swiss00 from "../../components/Swiss00";
import AdminDisplay from "../../components/AdminDisplay";
import NukeButton from "../../components/NukeButton";
import Swiss10 from "../../components/Swiss10";
import Swiss01 from "../../components/Swiss01";
import Swiss20 from "../../components/Swiss20";
import Swiss11 from "../../components/Swiss11";
import Swiss02 from "../../components/Swiss02";
import Swiss30 from "../../components/Swiss30";
import Swiss21 from "../../components/Swiss21";
import Swiss12 from "../../components/Swiss12";
import Swiss31 from "../../components/Swiss31";

const SwissBracket = ({ isAdmin }) => {
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

  const swiss00Data =
    bracketData &&
    bracketData.filter(
      (matchup) => matchup.stage === "Swiss" && matchup.round === "0-0"
    );

  const swiss10Data =
    bracketData &&
    bracketData.filter(
      (matchup) => matchup.stage === "Swiss" && matchup.round === "1-0"
    );

  const swiss01Data =
    bracketData &&
    bracketData.filter(
      (matchup) => matchup.stage === "Swiss" && matchup.round === "0-1"
    );

  const swiss20Data =
    bracketData &&
    bracketData.filter(
      (matchup) => matchup.stage === "Swiss" && matchup.round === "2-0"
    );

  const swiss11Data =
    bracketData &&
    bracketData.filter(
      (matchup) => matchup.stage === "Swiss" && matchup.round === "1-1"
    );

  const swiss02Data =
    bracketData &&
    bracketData.filter(
      (matchup) => matchup.stage === "Swiss" && matchup.round === "0-2"
    );

  const swiss30Data =
    bracketData &&
    bracketData.filter(
      (matchup) => matchup.stage === "Swiss" && matchup.round === "3-0"
    );

  const swiss21Data =
    bracketData &&
    bracketData.filter(
      (matchup) => matchup.stage === "Swiss" && matchup.round === "2-1"
    );

  const swiss12Data =
    bracketData &&
    bracketData.filter(
      (matchup) => matchup.stage === "Swiss" && matchup.round === "1-2"
    );

  const swiss31Data =
    bracketData &&
    bracketData.filter(
      (matchup) => matchup.stage === "Swiss" && matchup.round === "3-1"
    );

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
        axios.put(
          `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${teamName}/Swiss`
        );
        axios.put(
          `https://localhost-api-1c3554ca2868.herokuapp.com/finalsSeed/${teamName}/0`
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
                if (stageChange === "playoffs") {
                  axios.put(
                    `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${winner}/${stageChange}`
                  );
                } else if (stageChange === "consolation") {
                  if (winner === blue) {
                    axios.put(
                      `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${red}/${stageChange}`
                    );
                  } else if (winner === red) {
                    axios.put(
                      `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${blue}/${stageChange}`
                    );
                  }
                } else if (stageChange === "consolationSpecial") {
                  axios.put(
                    `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${red}/consolation`
                  );

                  axios.put(
                    `https://localhost-api-1c3554ca2868.herokuapp.com/setStage/${blue}/consolation`
                  );
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

  return (
    <>
      {isAdmin && <AdminDisplay />}
      {loading ? (
        <div className="dot-pulse"></div>
      ) : (
        <div className="swiss-container">
          <div className="round round-1">
            <h2 className="time-box">11:00 AM</h2>
            <Swiss00
              swiss00Data={swiss00Data}
              teamData={teamData}
              isAdmin={isAdmin}
              updateMatchups={updateMatchups}
              updateWinner={updateWinner}
            />
          </div>
          <div className="round round-2">
            <h2 className="time-box">12:00 PM</h2>
            <Swiss10
              swiss10Data={swiss10Data}
              teamData={teamData}
              isAdmin={isAdmin}
              updateMatchups={updateMatchups}
              updateWinner={updateWinner}
            />
            <Swiss01
              swiss01Data={swiss01Data}
              teamData={teamData}
              isAdmin={isAdmin}
              updateMatchups={updateMatchups}
              updateWinner={updateWinner}
            />
          </div>
          <div className="round round-3">
            <h2 className="time-box">1:00 PM</h2>
            <Swiss20
              swiss20Data={swiss20Data}
              teamData={teamData}
              isAdmin={isAdmin}
              updateMatchups={updateMatchups}
              updateWinner={updateWinner}
            />
            <Swiss11
              swiss11Data={swiss11Data}
              teamData={teamData}
              isAdmin={isAdmin}
              updateMatchups={updateMatchups}
              updateWinner={updateWinner}
            />
            <Swiss02
              swiss02Data={swiss02Data}
              teamData={teamData}
              isAdmin={isAdmin}
              updateMatchups={updateMatchups}
              updateWinner={updateWinner}
            />
          </div>
          <div className="round round-4">
            <h2 className="time-box">2:00 PM</h2>
            <Swiss30
              swiss30Data={swiss30Data}
              teamData={teamData}
              isAdmin={isAdmin}
              updateMatchups={updateMatchups}
              updateWinner={updateWinner}
            />
            <Swiss21
              swiss21Data={swiss21Data}
              teamData={teamData}
              isAdmin={isAdmin}
              updateMatchups={updateMatchups}
              updateWinner={updateWinner}
            />
            <Swiss12
              swiss12Data={swiss12Data}
              teamData={teamData}
              isAdmin={isAdmin}
              updateMatchups={updateMatchups}
              updateWinner={updateWinner}
            />
          </div>
          <div className="round round-5">
            <h2 className="time-box">3:00 PM</h2>
            <Swiss31
              swiss31Data={swiss31Data}
              teamData={teamData}
              isAdmin={isAdmin}
              updateMatchups={updateMatchups}
              updateWinner={updateWinner}
            />
          </div>

          {isAdmin && <NukeButton resetBracket={resetBracket} />}
        </div>
      )}
    </>
  );
};

export default SwissBracket;
