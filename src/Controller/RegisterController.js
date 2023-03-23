import { response } from "express";
import bcrypt from "bcrypt";
import pool from "../Database/mysql.js";
import { generateJsonWebToken } from "../Lib/JwToken.js";

export const registerUser = async (req, res = response) => {
  const {
    name,
    email,
    password,
    phone,
    state,
    city,
    area,
    address,
    pincode,
    refferalcode,
  } = req.body;
  const wallets = 10;
  const profileid =
    "JDC" + Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
  const status = 1;
  const counter = 1;
  const jdbdstatus = 1;
  const login_type = 0;
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const requireddate =
    formattedDate.split(" ")[0] +
    "/" +
    formattedDate.split(" ")[1] +
    "/" +
    formattedDate.split(" ")[2];

  const currentTime = new Date();
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  try {
    const validatedEmail = await pool.query(
      `SELECT * FROM users WHERE phone='${name}'`
    );
    const counter = await pool.query(
      `SELECT sum(counter) as counter FROM users`
    );
    const getwalletbonus = await pool.query(
      `SELECT * FROM walletamount WHERE id=1`
    );
    const getreferraluser = await pool.query(
      `SELECT * FROM users WHERE profileid='${refferalcode}'`
    );
    const getreferralvendor = await pool.query(
      `SELECT * FROM vendor WHERE vendorid='${refferalcode}'`
    );

    const referalwallets =
      getreferraluser.length > 0
        ? getreferraluser[0].wallets
        : getreferralvendor.length > 0
        ? getreferralvendor[0].wallets
        : 0;

    const referalid =
      getreferraluser.length > 0
        ? getreferraluser[0].profileid
        : getreferralvendor.length > 0
        ? getreferralvendor[0].vendorid
        : "0";
    const totalwallets =
      Number(referalwallets) + Number(getwalletbonus[0].userpoint);

    if (validatedEmail.length > 0) {
      return res.status(401).json({
        resp: false,
        msg: "Email already exists",
      });
    }

    const jdbdid =
      counter.length > 0
        ? "JDBD20230" + (counter[0].counter + 1)
        : "JDBD202301";

    await pool
      .query(
        `INSERT INTO users (name,email,password,phone,state,city,area,pincode,address,refferalcode,wallets,profileid,jdbdid,jdbdstatus,login_type,date,time,status,counter) VALUES('${name}','${email}','${password}','${phone}','${state}','${city}','${area}','${pincode}','${address}','${refferalcode}','${wallets}','${profileid}','${jdbdid}','${jdbdstatus}','${login_type}','${requireddate}','${formattedTime}','${status}','${counter}')`
      )
      .then((e) => {
        if (refferalcode) {
          if (getreferraluser.length > 0) {
            pool.query(
              `UPDATE users SET wallets='${totalwallets}' WHERE profileid='${referalid}'`
            );
          }
          if (getreferralvendor.length > 0) {
            pool.query(
              `UPDATE vendor SET wallets='${totalwallets}' WHERE vendorid='${referalid}'`
            );
          }
        }
      })

      .then(async (run) => {
        const validatedUserEmail = await pool.query(
          `SELECT * FROM users WHERE email='${email}' OR phone='${email}' and password='${password}' and status=1`
        );

        const user = validatedUserEmail[0];
        let token = await generateJsonWebToken(user.profileid);

        return res.json({
          resp: true,
          msg: "Login SuccessFull",
          user: {
            uid: user.id,
            firstName: user.name,
            image: user.profileimage,
            email: user.email,
            mainId: user.profileid,
            type: "user",
          },
          token,
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
