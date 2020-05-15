"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return Promise.all([
      queryInterface.changeColumn("GameRecords", "totalBet", {
        allowNull: false,
        type: Sequelize.FLOAT
      }),
      queryInterface.changeColumn("GameRecords", "totalWin", {
        allowNull: false,
        type: Sequelize.FLOAT
      }),
      queryInterface.changeColumn("GameRecords", "winLost", {
        allowNull: false,
        type: Sequelize.FLOAT
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return Promise.all([
      queryInterface.changeColumn("GameRecords", "totalBet", {
        allowNull: false,
        type: Sequelize.BIGINT
      }),
      queryInterface.changeColumn("GameRecords", "totalWin", {
        allowNull: false,
        type: Sequelize.BIGINT
      }),
      queryInterface.changeColumn("GameRecords", "winLost", {
        allowNull: false,
        type: Sequelize.BIGINT
      })
    ]);
  }
};
