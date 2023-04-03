import { response } from "express";
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

export const putstory = async (req, res = response) => {
  try {
    const { main_id } = req.body;

    const userquery = `SELECT * FROM users WHERE status=1 `;
    const vendorquery = `SELECT * FROM vendor WHERE status=1 `;

    const userdb = await getData(userquery).then((row) => {
      return row;
    });
    const vendordb = await getData(vendorquery).then((row) => {
      return row;
    });

    let alldb = [...userdb, ...vendordb];

    const givenvalue = (i) =>
      alldb.filter((a) => {
        return a.vendorid === i || a.profileid === i;
      });

    const main_name =
      givenvalue(main_id)[0].businessname ||
      givenvalue(main_id)[0].firstname ||
      givenvalue(main_id)[0].name;

    const image = req.file;

    console.log("storyuploaded", image);
    pool.query(
      `INSERT INTO public_story ( main_id,user_name,attachment,attachment_type) VALUES ('${main_id}','${main_name}','${
        image.filename
      }','${
        image.mimetype == "application/pdf"
          ? "pdf"
          : image.mimetype.split("/")[0]
      }')`
    );

    res.json({
      resp: true,
      msg: "Story added Successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const getmystory = async (req, res = response) => {
  try {
    const { main_id } = req.body;

    const storyquery = `SELECT * FROM public_story WHERE main_id='${main_id}' and created >= now() - INTERVAL 1 DAY `;

    pool
      .query(storyquery)
      .then((run) => {
        return res.json({
          resp: true,
          stories: run,
        });
      })
      .catch((error) => {
        return res.status(401).json({
          resp: false,
          stories: error,
        });
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      resp: false,
      stories: e,
    });
  }
};

export const getuserconnectedstories = async (req, res = response) => {
  try {
    const { main_id } = req.body;

    const chatroom =
      "SELECT chatroom from public_chat WHERE chatroom LIKE '%" +
      main_id +
      "%'  GROUP BY  chatroom ";

    const storyquery = `SELECT * FROM public_story WHERE created >= now() - INTERVAL 1 DAY `;

    const storydb = await getData(storyquery).then((row) => {
      return row;
    });

    const givenvalue = (i) =>
      storydb.filter((a) => {
        return a.main_id === i;
      });

    pool
      .query(chatroom)
      .then((run) => {
        return res.json({
          resp: true,
          msg: run
            .map((i) => {
              return {
                storylength: givenvalue(i.chatroom.replace(main_id, "")).length,
                story: givenvalue(i.chatroom.replace(main_id, "")),
              };
            })
            .filter((a) => a.storylength != 0),
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
