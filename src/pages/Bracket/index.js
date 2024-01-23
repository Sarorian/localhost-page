import React, { useState, useEffect } from "react";
import common from "../../helpers/common";
import axios from "axios";
import Swiss00 from "../../components/Swiss00";
import AdminDisplay from "../../components/AdminDisplay";

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

  const swiss00data =
    bracketData &&
    bracketData.filter(
      (matchup) => matchup.stage === "Swiss" && matchup.round === "0-0"
    );

  const updateMatchups = async (matchups, stage, round) => {
    try {
      matchups.forEach((matchup, index) => {
        const filteredBracketGames = bracketData.filter((game) => {
          return game.stage === stage && game.round === round;
        });
        const { blue, red, winner } = matchup;
        if (
          blue === filteredBracketGames[index].teams.blue.teamName &&
          red === filteredBracketGames[index].teams.red.teamName
        ) {
          if (
            winner !== "" &&
            filteredBracketGames[index].winner.teamName === winner
          ) {
            const endpoint = `https://localhost-api-1c3554ca2868.herokuapp.com/update/winner/${stage}/${round}/${
              index + 1
            }/${winner}`;
            axios.put(endpoint).then((response) => {
              if (response.status === 200) {
                common.displayMessage("success", "Match updated successfully");
                setStateVal((prev) => ({
                  ...prev,
                  loading: true,
                }));
              } else {
                common.displayMessage("error", "Failed to update match");
              }
            });
          }
        }
        if (
          blue === filteredBracketGames[index].teams.blue.teamName &&
          red === filteredBracketGames[index].teams.red.teamName
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
            swiss00Data={swiss00data}
            teamData={teamData}
            isAdmin={isAdmin}
            updateMatchups={updateMatchups}
          />
        </div>
      )}
    </>
  );
};

export default Bracket;
