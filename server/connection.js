var express = require("express");
const mysql = require("mysql");

var options = {
  host: "localhost",
  user: "root",
  database: "online_market",
};

var con = mysql.createConnection(options);

con.connect((err) => {
  if (err) {
    console.log("Can not connect to DB");
    console.log(err);
    return;
  }
});


module.exports = con;
