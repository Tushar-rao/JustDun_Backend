import mysql from "mysql";
import { promisify } from "util";

const pool = mysql.createPool({
  host: "216-10-245-91.cprapid.com",
  user: "justd21e_gobusiness_dun_us",
  password: "])R?Xdm6X1#e",
  database: "justd21e_gobusiness_dun_db",
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST")
      console.log("DATABASE CONNECTION WAS CLOSED");
    if (err.code === "ER_CON_COUNT_ERROR")
      console.log("DATABASE HAS TO MANY CONNECTIONS");
    if (err.code === "ECONNREFUSED")
      console.log("DATABASE CONNECTION WAS REFUSED");
  }

  if (connection) connection.release();

  console.log("DataBase is connected to " + process.env.DB_DATABASE);
  return;
});

pool.query = promisify(pool.query);

export default pool;
