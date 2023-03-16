import { response } from "express";
import bcrypt from "bcrypt";
import pool from "../Database/mysql.js";

function getData(query) {
  return new Promise((resolve, reject) => {
    pool.query(query, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export const billing_controller = async (req, res = response) => {
  try {
    const { category, profileid, usertype } = req.body;
    const select = `SELECT * FROM billing WHERE category='${category}' and sessionid='${profileid}' and sessiontype='${usertype}' ORDER BY id DESC`;

    getData(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: `Got ${category} Details`,
          billdetails: run,
        });
      })
      .catch((error) => {
        return res.status(401).json({
          resp: false,
          msg: error,
        });
      });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const credit_accept_controller = async (req, res = response) => {
  try {
    const { billingid } = req.body;
    const query1 = `UPDATE billing SET status=1 WHERE billingid='${billingid}' and category='Credit'`;
    const query2 = `UPDATE billing SET status=1 WHERE billingid='${billingid}' and category='Debit'`;

    pool
      .query(query1)
      .then((e) => {
        return pool.query(query2);
      })
      .then((run) => {
        res.json({
          resp: true,
          msg: `Accepted Successfully`,
        });
      })
      .catch((error) => {
        return res.status(401).json({
          resp: false,
          msg: error,
        });
      });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const credit_decline_controller = async (req, res = response) => {
  try {
    const { billingid, profileid } = req.body;
    const query1 = `UPDATE billing SET status=3 WHERE billingid='${billingid}' and category='Credit'`;
    const query2 = `UPDATE billing SET status=3 WHERE billingid='${billingid}' and category='Debit'`;
    const query3 = `DELETE FROM billing WHERE billingid='${billingid}' and sessionid='${profileid}'`;

    pool
      .query(query1)
      .then((e) => {
        return pool.query(query2);
      })
      .then((e) => {
        return pool.query(query3);
      })
      .then((run) => {
        res.json({
          resp: true,
          msg: `Decline Successfully`,
        });
      })
      .catch((error) => {
        return res.status(401).json({
          resp: false,
          msg: error,
        });
      });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const debit_delete_controller = async (req, res = response) => {
  try {
    const { billingid } = req.body;
    const select = `DELETE FROM billing WHERE billingid='${billingid}'`;

    pool
      .query(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: `Deleted Successfully`,
        });
      })
      .catch((error) => {
        return res.status(401).json({
          resp: false,
          msg: error,
        });
      });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const sendmoney = async (req, res = response) => {
  try {
    const { amount, userid, note, sessionid, sendertype, recievertype } =
      req.body;

    let date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${day}-${month}-${year}`;

    const billingid = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);

    //check sender wallet for available payment
    var checksender;
    if (sendertype == "user") {
      checksender = `SELECT * FROM users WHERE profileid='${sessionid}'  and status=1`;
    } else {
      checksender = `SELECT * FROM vendor WHERE vendorid='${sessionid}'  and status=1`;
    }
    //check reciever wallet for availablility
    var checkrecievequery;
    if (recievertype == "user") {
      checkrecievequery = `SELECT * FROM users WHERE profileid='${userid}'  and status=1`;
    } else {
      checkrecievequery = `SELECT * FROM vendor WHERE vendorid='${userid}'  and status=1`;
    }
    //update sender wallet money deduct money
    var senderwalletupdate;
    if (sendertype == "user") {
      senderwalletupdate = `UPDATE users SET main_wallet = main_wallet - ${amount} WHERE profileid='${sessionid}'  and status=1`;
    } else {
      senderwalletupdate = `UPDATE vendor SET main_wallet = main_wallet - ${amount} WHERE vendorid='${sessionid}'  and status=1`;
    }
    //for sender table data
    const query1 = `INSERT INTO transaction (billingid,category,note,amount,userid,sessionid,date,time,status) VALUES ('${billingid}','Sended','${note}','${amount}','${sessionid}','${userid}','${currentDate}','${new Date().toLocaleTimeString()}','success')`;
    //update reciever wallet add money
    var recieverwalletupdate;
    if (recievertype == "user") {
      recieverwalletupdate = `UPDATE users SET main_wallet = main_wallet + ${amount} WHERE profileid='${userid}'  and status=1`;
    } else {
      recieverwalletupdate = `UPDATE vendor SET main_wallet = main_wallet + ${amount} WHERE vendorid='${userid}'  and status=1`;
    }
    //for reciever
    const query2 = `INSERT INTO transaction (billingid,category,note,amount,userid,sessionid,date,time,status) VALUES ('${billingid}','Recieved','${note}','${amount}','${userid}','${sessionid}','${currentDate}','${new Date().toLocaleTimeString()}','success')`;
    // done

    const validsender = await pool.query(checksender);

    if (validsender[0].main_wallet < amount) {
      return res.status(400).json({
        resp: false,
        msg: "Invalid Balance",
      });
    }

    pool
      .query(checkrecievequery)
      .then((result3) => {
        return pool.query(senderwalletupdate);
      })
      .then((result4) => {
        return pool.query(query1);
      })
      .then((result5) => {
        return pool.query(recieverwalletupdate);
      })
      .then((result6) => {
        return pool.query(query2);
      })
      .then((run) => {
        return res.json({
          resp: true,
          msg: "Added successfully",
        });
      })
      .catch((error) => {
        return res.status(401).json({
          resp: false,
          msg: error,
        });
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};
