const dialect = "mysql";

module.exports = {
  development: {
    username: "root",
    password: "123456",
    database: "gameRecord_development",
    host: "mysql",
    // eslint-disable-next-line object-shorthand
    dialect: dialect,
    autoMigrate: true
  },
  test: {
    username: "root",
    password: null,
    database: "gameRecord_test",
    host: "mysql",
    // eslint-disable-next-line object-shorthand
    dialect: dialect
  },
  production: {
    username: "root",
    password: null,
    database: "gameRecord_production",
    host: "mysql",
    // eslint-disable-next-line object-shorthand
    dialect: dialect
  }
};
