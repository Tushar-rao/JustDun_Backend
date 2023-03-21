import { response } from "express";
import bcrypt from "bcrypt";
import pool from "../Database/mysql.js";

export const registerClient = async (req, res = response) => {
  const {
    name,
    email,
    password,
    phone,
    state,
    city,
    area,
    pincode,
    refferalcode,
  } = req.body;
  const imagePath = req.file.filename;

  try {
    const validatedEmail = await pool.query(
      `SELECT * FROM users WHERE phone='${name}'`
    );

    if (validatedEmail.length > 0) {
      return res.status(401).json({
        resp: false,
        msg: "Email already exists",
      });
    }

    await pool
      .query(
        `INSERT INTO users (name,email,password,phone,state,city,area,pincode,refferalcode,wallets,profileid,jdbdid,jdbdstatus,login_type,date,time,status,counter) VALUES('${name}','${email}','${password}','${phone}','${state}','${city}','${area}','${pincode}','${refferalcode}','${wallets}','${profileid}','${jdbdid}','${jdbdstatus}','${login_type}','${date}','${time}','${status}','${counter}')`
      )
      .then((e) => {
        return pool.query(`SELECT sum(counter) as counter FROM users`);
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
  } catch (err) {
    return res.status(500).json({
      resp: false,
      msg: err,
    });
  }
};

export const registerDelivery = async (req, res = response) => {
  try {
    const { firstname, lastname, phone, email, password, notification_token } =
      req.body;
    const imagePath = req.file.filename;

    const validatedEmail = await pool.query(
      "SELECT email FROM users WHERE email = ?",
      [email]
    );

    if (validatedEmail.length > 0) {
      return res.status(401).json({
        resp: false,
        msg: "Email already exists",
      });
    }

    let salt = bcrypt.genSaltSync();
    const pass = bcrypt.hashSync(password, salt);

    await pool.query(`CALL SP_REGISTER(?,?,?,?,?,?,?,?);`, [
      firstname,
      lastname,
      phone,
      imagePath,
      email,
      pass,
      3,
      notification_token,
    ]);

    res.json({
      resp: true,
      msg: "Devlivery successfully registered",
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};
