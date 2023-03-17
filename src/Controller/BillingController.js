import { response } from "express";
import bcrypt from "bcrypt";
import pool from "../Database/mysql.js";
import { generateJsonWebToken } from "../Lib/JwToken.js";

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

export const create_new_ledger = async (req, res = response) => {
  try {
    const {
      category,
      title,
      description,
      amount,
      userid,
      profile,
      sessionid,
      sessiontype,
      billname,
    } = req.body;

    let date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${day}-${month}-${year}`;
    let categories = category == "Debit" ? "Credit" : "Debit";
    let sessiontypes = profile == "user" ? "users" : "vendor";
    let profiletosend = profile == "user" ? "User" : "Vendor";

    const billingid = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);

    const query1 = `INSERT INTO billing (billingid,category,title,description,amount,userid,profile,sessionid,sessiontype,date,time,status) VALUES ('${billingid}','${category}','${title}','${description}','${amount}','${sessionid}','${profiletosend}','${userid}','${sessiontype}','${currentDate}','${new Date().toLocaleTimeString()}','2')`;
    const query2 = `INSERT INTO billing (billingid,category,title,description,amount,userid,profile,sessionid,sessiontype,date,time,status) VALUES ('${billingid}','${categories}','${billname}','${description}','${amount}','${userid}','User','${sessionid}','${sessiontypes}','${currentDate}','${new Date().toLocaleTimeString()}','2')`;

    pool
      .query(query1)
      .then((e) => {
        return pool.query(query2);
      })
      .then((run) => {
        console.log(run);
        return res.json({
          resp: true,
          msg: "Added successfully",
        });
      })
      .catch((error) => {
        console.log(error);
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

export const referearn_page = async (req, res = response) => {
  try {
    const { profileid } = req.body;
    const validatedUserEmail = await pool.query(
      `SELECT * FROM users WHERE profileid='${profileid}' and status=1`
    );
    const user = validatedUserEmail[0];

    const total_share = await getData(
      `SELECT sum(counter) as counter FROM vendor WHERE refferalcode='${user.jdbdid}'`
    ).then((row) => {
      return row;
    });
    const total_share_price = [...total_share];
    const approved = await getData(
      `SELECT sum(counter) as counter FROM vendor WHERE refferalcode='${user.jdbdid}' and activated=1`
    ).then((row) => {
      return row;
    });
    const approved_price = [...approved];
    const pending = await getData(
      `SELECT sum(counter) as counter FROM vendor WHERE refferalcode='${user.jdbdid}' and activated=2`
    ).then((row) => {
      return row;
    });
    const pending_price = [...pending];
    const cancelled = await getData(
      `SELECT sum(counter) as counter FROM vendor WHERE refferalcode='${user.jdbdid}' and activated=3`
    ).then((row) => {
      return row;
    });
    const cancelled_price = [...cancelled];

    res.json({
      resp: true,
      msg: {
        userid: user.jdbdid,
        userstatus: user.jdbdstatus,
        active: user.activepending,
        total_share:
          total_share_price[0].counter != null
            ? total_share_price[0]?.counter
            : 0,
        approved_price:
          (approved_price[0].counter != null) != 0
            ? approved_price[0]?.counter
            : 0,
        pending_price:
          (pending_price[0].counter != null) != 0
            ? pending_price[0]?.counter
            : 0,
        cancelled_price:
          (cancelled_price[0].counter != null) != 0
            ? cancelled_price[0]?.counter
            : 0,
        earning: user.earning,
        paidamount: user.paidamount,
        payableamount: user.payableamount,
      },
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};
