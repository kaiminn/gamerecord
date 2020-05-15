module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    const addCurrencyType = queryInterface.addColumn(
      "GameRecords",
      "currencyType",
      {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: "TWD"
      }
    );
    const addGameType = queryInterface.addColumn("GameRecords", "gameType", {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue: "SlotGame"
    });

    return Promise.all([addCurrencyType, addGameType]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

    const removeCurrencyType = queryInterface.removeColumn(
      "GameRecords",
      "currencyType"
    );
    const removeSlotGame = queryInterface.removeColumn(
      "GameRecords",
      "SlotGame"
    );
    return Promise.all([removeCurrencyType, removeSlotGame]);
  }
};
