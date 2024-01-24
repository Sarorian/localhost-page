import React, { useState, useEffect } from "react";
import common from "../../helpers/common";
import axios from "axios";
import AdminDisplay from "../../components/AdminDisplay";
import NukeButton from "../../components/NukeButton";

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
          <>Consolation Bracket</>
          {isAdmin && <NukeButton resetBracket={resetBracket} />}
        </div>
      )}
    </>
  );
};

export default ConsolationBracket;
