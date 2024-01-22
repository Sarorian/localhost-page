import React, { useState } from "react";

const TeamsView = ({
  teamsData,
  isAdmin,
  onDeletePlayer,
  onAddPlayer,
  onAddTeam,
  onDeleteTeam,
}) => {
  const [newPlayers, setNewPlayers] = useState({});
  const [newTeam, setNewTeam] = useState({
    teamName: "",
    players: ["", "", "", "", ""],
    seed: "",
  });
  const sortedTeams = teamsData.sort((a, b) => a.seed - b.seed);

  const handleNewPlayerChange = (teamName, value) => {
    setNewPlayers((prevNewPlayers) => ({
      ...prevNewPlayers,
      [teamName]: value,
    }));
  };

  const handleTeamNameChange = (value) => {
    setNewTeam((prevNewTeam) => ({
      ...prevNewTeam,
      teamName: value,
    }));
  };

  const handleNewTeamChange = (index, value) => {
    setNewTeam((prevNewTeam) => ({
      ...prevNewTeam,
      players: [
        ...prevNewTeam.players.slice(0, index),
        value,
        ...prevNewTeam.players.slice(index + 1),
      ],
    }));
  };

  const handleSeedChange = (value) => {
    setNewTeam((prevNewTeam) => ({
      ...prevNewTeam,
      seed: value,
    }));
  };

  const handleAddTeam = (teamName, players, seed) => {
    onAddTeam(teamName, players, seed);
    setNewPlayers({});
    setNewTeam({
      teamName: "",
      players: ["", "", "", "", ""],
      seed: "",
    });
  };

  return (
    <>
      <div className="teams-container">
        {isAdmin && (
          <div key="addTeam" className="team-box">
            <h2>Add a Team</h2>
            <input
              key="teamName"
              type="text"
              placeholder="Team Name"
              value={newTeam.teamName}
              onChange={(e) => handleTeamNameChange(e.target.value)}
            ></input>
            <div key="dataToAdd" className="add-team-inputs">
              {[1, 2, 3, 4, 5].map((index) => (
                <input
                  key={`playerInput_${index}`}
                  type="text"
                  placeholder={`Player${index}#Tag${index}`}
                  value={newTeam.players[index - 1]}
                  onChange={(e) =>
                    handleNewTeamChange(index - 1, e.target.value)
                  }
                ></input>
              ))}
              <input
                key="seed"
                type="number"
                placeholder="Seed"
                value={newTeam.seed}
                onChange={(e) => handleSeedChange(e.target.value)}
              ></input>
              <button
                onClick={() =>
                  handleAddTeam(newTeam.teamName, newTeam.players, newTeam.seed)
                }
              >
                Add Team
              </button>
            </div>
          </div>
        )}

        {sortedTeams.map((team, index) => (
          <div key={index + 1} className="team-box">
            {isAdmin && (
              <>
                <button
                  className="delete-button"
                  onClick={() => onDeleteTeam(team.teamName)}
                >
                  Remove
                </button>
              </>
            )}
            <h2>
              <a
                href={`https://www.op.gg/multisearch/na?summoners=${team.players
                  .map((player) => `${player.gameName}%23${player.tag}`)
                  .join("%2C")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="team-link"
              >
                {team.teamName} (Seed: {team.seed})
              </a>
            </h2>
            <div>
              {team.players.map((player, playerIndex) => (
                <div key={playerIndex}>
                  <span style={{ paddingRight: "5px" }}>{player.gameName}</span>
                  {isAdmin && (
                    <button
                      className="delete-button"
                      onClick={() =>
                        onDeletePlayer(
                          team.teamName,
                          player.gameName,
                          player.tag
                        )
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div>
              <div>
                <span>Wins: {team.record.wins}</span>
                <span> Losses: {team.record.losses}</span>
                {isAdmin && (
                  <>
                    <input
                      type="text"
                      value={newPlayers[team.teamName] || ""}
                      placeholder="Player#Tag"
                      onChange={(e) =>
                        handleNewPlayerChange(team.teamName, e.target.value)
                      }
                    ></input>
                    <button
                      onClick={() =>
                        onAddPlayer(team.teamName, newPlayers[team.teamName])
                      }
                    >
                      Add to team
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TeamsView;
