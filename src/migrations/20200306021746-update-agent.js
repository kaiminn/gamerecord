module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    await queryInterface.sequelize.query(
      "CREATE FUNCTION SPLIT_STR( x VARCHAR(255), delim VARCHAR(12), pos INT ) " +
        "RETURNS VARCHAR(255) RETURN REPLACE(SUBSTRING(SUBSTRING_INDEX(x, delim, pos)," +
        " LENGTH(SUBSTRING_INDEX(x, delim, pos -1)) + 1),delim, '');"
    );

    await queryInterface.addColumn("GameRecords", "agentID", {
      allowNull: false,
      type: Sequelize.STRING
    });

    return queryInterface.sequelize.transaction(async t => {
      queryInterface.sequelize.query(
        "UPDATE `GameRecords` SET memberID=CONCAT(memberID , '@', 'mabu777'), agentID = 'mabu777'",
        { transaction: t }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

    // Add FUNCTION SPLIT_STR
    await queryInterface.sequelize.query(
      "CREATE FUNCTION SPLIT_STR( x VARCHAR(255), delim VARCHAR(12), pos INT ) " +
        "RETURNS VARCHAR(255) RETURN REPLACE(SUBSTRING(SUBSTRING_INDEX(x, delim, pos)," +
        " LENGTH(SUBSTRING_INDEX(x, delim, pos -1)) + 1),delim, '');"
    );

    await queryInterface.sequelize.transaction(async t => {
      queryInterface.sequelize.query(
        "UPDATE `GameRecords` SET `memberID` = (SELECT SPLIT_STR(memberID, '@',1) as memberID)",
        {
          transaction: t
        }
      );
    });

    await queryInterface.removeColumn("GameRecords", "agentID");
    // DROP FUNCTION SPLIT_STR
    return queryInterface.sequelize.query("DROP FUNCTION `SPLIT_STR`");
  }
};
