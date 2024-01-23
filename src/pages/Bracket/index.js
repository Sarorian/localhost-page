import React, { useState, useEffect } from "react";
import common from "../../helpers/common";
import axios from "axios";
import Swiss00 from "../../components/Swiss00";
import AdminDisplay from "../../components/AdminDisplay";
import NukeButton from "../../components/NukeButton";
import Swiss10 from "../../components/Swiss10";
import Swiss01 from "../../components/Swiss01";

const Bracket = ({ isAdmin }) => {
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

  const updateResults = (winner, blue, red) => {
    const winnerURL = `https://localhost-api-1c3554ca2868.herokuapp.com/giveWin/${winner}`;
    const loserURL = `https://localhost-api-1c3554ca2868.herokuapp.com/giveLoss/`;

    axios.put(winnerURL);
    axios.put(`${loserURL}${winner === blue ? red : blue}`);
  };

  const updateWinner = async (matchups, stage, round) => {
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

  const updateMatchups = async (matchups, stage, round) => {
    try {
      const filteredBracketGames = bracketData.filter((game) => {
        return game.stage === stage && game.round === round;
      });
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
              common.displayMessage("error", "Error updating match");
            });
        }
      });
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
          <Swiss00
            swiss00Data={swiss00Data}
            teamData={teamData}
            isAdmin={isAdmin}
            updateMatchups={updateMatchups}
            updateWinner={updateWinner}
          />
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
          {isAdmin && <NukeButton resetBracket={resetBracket} />}
        </div>
      )}
    </>
  );
};

export default Bracket;
