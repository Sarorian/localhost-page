import React from "react";
import { useState, useEffect } from "react";
import common from "../../helpers/common";
import axios from "axios";
import TeamsView from "../../components/TeamsView";

const Teams = ({ isAdmin }) => {
  const [stateVal, setStateVal] = useState({
    teamsData: null,
    loading: true,
  });

  const { teamsData, loading } = stateVal;

  const onDeletePlayer = async (teamName, gameName, tag) => {
    try {
      const formattedTeamName = teamName.replace(/ /g, "_");
      const endpoint = `https://localhost-api-1c3554ca2868.herokuapp.com/removePlayer/${gameName}/${tag}/${formattedTeamName}`;
      const response = await axios.post(endpoint);
      if (response.status === 200) {
        common.displayMessage("success", "Player removed successfully");
        setStateVal((prev) => ({
          ...prev,
          loading: true,
        }));
      } else {
        common.displayMessage("error", "Failed to remove player");
      }
    } catch (error) {
      console.error("Error deleting player:", error.message);
      common.displayMessage("error", "Error deleting player");
    }
  };

  const onAddTeam = async (teamName, players, seed) => {
    try {
      const playerNamesTags = players.map((player) => {
        const [gameName, tag] = player.split("#");
        return { Name: gameName, Tag: tag };
      });

      const postData = {
        teamName,
        players: [playerNamesTags],
        seed,
      };

      const response = await axios.post(
        "https://localhost-api-1c3554ca2868.herokuapp.com/addTeam",
        postData
      );

      if (response.status === 201) {
        common.displayMessage("success", "Team added successfully");
        setStateVal((prev) => ({
          ...prev,
          loading: true,
        }));
      } else {
        common.displayMessage("error", "Failed to add team");
      }
    } catch (error) {
      console.error("Error adding team:", error.message);
      common.displayMessage("error", "Error adding team");
    }
  };

  const onAddPlayer = async (teamName, player) => {
    try {
      const formattedTeamName = teamName.replace(/ /g, "_");
      const [gameName, tag] = player.split("#");
      const endpoint = `https://localhost-api-1c3554ca2868.herokuapp.com/addPlayer/${gameName}/${tag}/${formattedTeamName}`;
      const response = await axios.post(endpoint);
      if (response.status === 200) {
        common.displayMessage("success", "Player added successfully");
        setStateVal((prev) => ({
          ...prev,
          loading: true,
        }));
      } else {
        common.displayMessage("error", "Failed to add player");
      }
    } catch (error) {
      console.error("Error deleting player:", error.message);
      common.displayMessage("error", "Error adding player");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "https://localhost-api-1c3554ca2868.herokuapp.com/teams"
        );
        setStateVal((prev) => ({
          ...prev,
          teamsData: data,
          loading: false,
        }));
      } catch (error) {
        common.displayMessage("error", "Error displaying data");
      }
    };
    fetchData();
  }, [loading]);

  return (
    <>
      {loading ? (
        <div className="dot-pulse"></div>
      ) : (
        <div>
          <TeamsView
            teamsData={teamsData}
            isAdmin={isAdmin}
            onDeletePlayer={onDeletePlayer}
            onAddPlayer={onAddPlayer}
            onAddTeam={onAddTeam}
          />
        </div>
      )}
    </>
  );
};

export default Teams;
