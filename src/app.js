"use strict";

const express = require("express");
const mysql = require("mysql");

const app = express()
const host = "0.0.0.0";
const port = "80";

const databaseHost = process.env.DB_HOST;
const databaseUser = process.env.DB_USERNAME;
const databasePassword = process.env.DB_PASSWORD;
const databaseName = "recommendations";
const tableName = "recommendation";
const databaseColumns = "id VARCHAR(255), artist VARCHAR(255), song VARCHAR(255)";

const connection = mysql.createConnection({
  host: databaseHost,
  user: databaseUser,
  password: databasePassword
});

connection.connect((error) => {
  if (error) throw error;
  console.log("Connected!");

  createDatabase(databaseName, (error, result) => {
    if (error) throw error;
    createTable(tableName, databaseColumns, (error, result) => {
      if (error) throw error;
      insertRecord(tableName, "id, artist, song", "'1000', 'Rick Astley', 'Never Gonna Give You Up'");
    });
  });
});

app.get("/", (request, response) => {
  response.setHeader("Content-Type", "application/json");

  let promise = new Promise((resolve, reject) => {
    getAllRecords(tableName, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject("Oops something went wrong...");
      }
    });
  });

  promise.then(
    function (result) {response.send("{\"recommendations\": " + JSON.stringify(result) + "}")},
    function (error) {response.send(error)}
  )
});

app.get("/clear", (request, response) => {
  response.setHeader("Content-Type", "application/json");
  queryDatabase(`DELETE FROM ${tableName}`, (error, result) => {
    if (error) throw response.send(error);
    response.sendStatus(200);
  });
});

app.get("/health", (request, response) => response.sendStatus(200));

app.listen(port, host, () => {
  console.log(`Discover weekly service available on ${host}:${port}`);
});

function createDatabase(databaseName, callback) {
  queryDatabase(`CREATE DATABASE IF NOT EXISTS ${databaseName}`, (error, result) => {
    if (error) throw error;
    queryDatabase(`USE ${databaseName}`, (error, result) => {
      console.log(`Using the database ${databaseName}`);
      if (callback) callback(error, result);
    });
  });
}

function createTable(tableName, columns, callback) {
  queryDatabase(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`, (error, result) => {
    if (error) throw error;
    console.log(`Table ${tableName} created!`);
    if (callback) callback(error, result);
  });
}

function insertRecord(tableName, columnNames, values, callback) {
  queryDatabase(`INSERT INTO ${tableName} (${columnNames}) VALUES (${values})`, (error, result) => {
    if (error) throw error;
    console.log("Record inserted into the database");
    if (callback) callback(error, result);
  });
}

function getAllRecords(tableName, callback) {
  queryDatabase(`SELECT * FROM ${tableName}`, (error, result) => {
    if (error) throw error;
    if (callback) callback(error, result);
  });
}

function queryDatabase(query, callback) {
  connection.query(query, (error, result) => {
    if (error) throw error;
    if (callback) callback(error, result);
  });
}