var express = require('express');
var Sequelize = require('sequelize');

module.exports = function( dbConnect ) {
  /* establish a connection with the database */
  const connect = new Sequelize('issueTrackerDB', 'ApolloAdmin', 'IssueTracker2017', {
      host: 'mtsu-4700-2017.database.windows.net',
      dialect: 'mssql',
      driver: 'tedious',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      port: 1433,
      dialectOptions: {
        encrypt: true
      }
    });

    /* authenticate the connection */
    connect
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully - conn.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
    });


  return connect;
};
