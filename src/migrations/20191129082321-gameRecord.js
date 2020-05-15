module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("GameRecords", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      memberID: {
        allowNull: false,
        type: Sequelize.STRING
      },
      gameID: {
        allowNull: false,
        type: Sequelize.STRING
      },
      seatID: {
        allowNull: false,
        type: Sequelize.STRING
      },
      roundCount: {
        allowNull: false,
        type: Sequelize.STRING
      },
      totalBet: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      totalWin: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      winLost: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      winType: {
        allowNull: false,
        type: Sequelize.STRING
      },
      debug: {
        type: Sequelize.BOOLEAN
      },
      gameInfo: {
        type: Sequelize.TEXT
      },
      playDateTime: {
        allowNull: false,
        type: Sequelize.DATE(6)
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("GameRecords");
  }
};
