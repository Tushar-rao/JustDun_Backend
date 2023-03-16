import { response } from "express";
import bcrypt from "bcrypt";
import pool from "../Database/mysql";
import { generateJsonWebToken } from "../Lib/JwToken";
import path from "path";

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

export const statecontroller = async (req, res = response) => {
  try {
    const select = `SELECT * FROM state ORDER BY id ASC`;

    getData(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: "Got States SuccessFull",
          states: run,
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

export const citycontroller = async (req, res = response) => {
  try {
    const { state_id } = req.body;
    const query = `SELECT * FROM city WHERE sid='${state_id}' and status=1`;
    getData(query)
      .then((run) => {
        if (run.length != 0) {
          res.json({
            resp: true,
            msg: "Got Cities SuccessFull",
            cities: run,
          });
        } else {
          res.json({
            resp: false,
            msg: "No City Found",
            cities: run,
          });
        }
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

export const areacontroller = async (req, res = response) => {
  try {
    const { city_id } = req.body;
    const query = `SELECT * FROM area WHERE cid='${city_id}' and status=1`;
    getData(query)
      .then((run) => {
        if (run.length != 0) {
          res.json({
            resp: true,
            msg: "Got Area SuccessFull",
            cities: run,
          });
        } else {
          res.json({
            resp: false,
            msg: "No area Found",
            cities: run,
          });
        }
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

///chat area apis
export const sendmessage = async (req, res = response) => {
  try {
    const { sender, receiver, message, attachment_type } = req.body;
    const attachment = req.files.length != 0 ? req.files[0].filename : "";
    let chatroomid = [sender, receiver].sort();

    const insertcart = `INSERT INTO public_chat (chatroom, sender, receiver, message, attachment, attachment_type,created) VALUES ('${
      chatroomid[0] + chatroomid[1]
    }','${sender}','${receiver}','${message}','${attachment}','${attachment_type}','${new Date().toLocaleTimeString()}')`;
    pool
      .query(insertcart)
      .then((run) => {
        console.log(run.insertId);
        return res.json({
          resp: true,
          msg: "Chat added successfully",
          deliveredchat: {
            id: run.insertId,
            sender: sender,
            receiver: receiver,
            chatroom: chatroomid[0] + chatroomid[1],
            message: message,
            attachment: attachment,
            attachment_type: attachment_type,
            created: new Date().toLocaleTimeString(),
          },
        });
      })
      .catch((error) => {
        return res.status(401).json({
          resp: false,
          msg: error,
        });
      });
  } catch (e) {
    console.log(req.files);
    console.log(e);
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const getchats = async (req, res = response) => {
  try {
    const insertcart = `SELECT * FROM public_chat WHERE 1`;
    pool
      .query(insertcart)
      .then((run) => {
        return res.json({
          resp: true,
          msg: run,
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

export const getspecific_chats = async (req, res = response) => {
  try {
    const { sender_id, receiver_id } = req.body;
    const insertcart = `SELECT * FROM public_chat WHERE sender='${sender_id}' AND receiver='${receiver_id}' OR sender='${receiver_id}' AND receiver='${sender_id}'  ORDER BY created ASC `;
    pool
      .query(insertcart)
      .then((run) => {
        return res.json({
          resp: true,
          msg: run,
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

export const getspecific_contacts = async (req, res = response) => {
  try {
    const { main_id } = req.body;
    // const insertcart =
    //   "SELECT * FROM public_chat WHERE chatroom LIKE '%" +
    //   main_id +
    //   "%' GROUP BY  chatroom  ";

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

    const insertcart =
      "SELECT id,chatroom,sender,receiver,max(message),max(attachment),max(created) from public_chat WHERE chatroom LIKE '%" +
      main_id +
      "%'  GROUP BY  chatroom ";

    pool
      .query(insertcart)
      .then((run) => {
        return res.json({
          resp: true,

          msg: run.map((i) => {
            return {
              message_data: i,

              user_data: givenvalue(i.chatroom.replace(main_id, "")).map(
                (i) => {
                  return {
                    name: i.businessname || i.firstname || i.name,
                    mainid: i.profileid || i.vendorid,
                    image: i.profileimage || i.shopphoto || "",
                  };
                }
              ),
            };
          }),
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

export const getappcontacts = async (req, res = response) => {
  try {
    const { phonelist } = req.body;

    const userquery = `SELECT * FROM users WHERE status=1 `;
    const vendorquery = `SELECT * FROM vendor WHERE status=1 `;

    const userdb = await getData(userquery).then((row) => {
      return row;
    });
    const vendordb = await getData(vendorquery).then((row) => {
      return row;
    });

    let alldb = [...userdb, ...vendordb];

    const checknumber = (i) =>
      alldb.some((a) => {
        return a.phone === i;
      });
    const givenvalue = (i) =>
      alldb.filter((a) => {
        return a.phone === i;
      });

    res.json({
      resp: true,
      msg: "Got List SuccessFull",
      list: phonelist
        .map((i) => {
          return {
            number: i,
            condition: checknumber(i),
            value: givenvalue(i).map((i) => {
              return {
                name: i.businessname || i.firstname || i.name,
                mainid: i.profileid || i.vendorid,
                image: i.profileimage || i.shopphoto || "",
              };
            }),
          };
        })
        .sort(function (a, b) {
          return b.condition - a.condition;
        }),
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};
