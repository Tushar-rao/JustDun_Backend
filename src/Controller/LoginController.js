import { response } from "express";
import bcrypt from "bcrypt";
import pool from "../Database/mysql.js";
import { generateJsonWebToken } from "../Lib/JwToken.js";

export const loginController = async (req, res = response) => {
  try {
    const { email, password } = req.body;

    const validatedUserEmail = await pool.query(
      `SELECT * FROM users WHERE email='${email}' OR phone='${email}' and password='${password}' and status=1`
    );

    const validatedVendorEmail = await pool.query(
      `SELECT * FROM vendor WHERE email='${email}' OR phone='${email}' and password='${password}' and status=1`
    );

    if (validatedUserEmail.length == 0 && validatedVendorEmail.length == 0) {
      return res.status(400).json({
        resp: false,
        msg: "Wrong Credentials",
      });
    }

    if (validatedUserEmail.length != 0) {
      const user = validatedUserEmail[0];

      if (password != user.password) {
        return res.status(401).json({
          resp: false,
          msg: "Wrong Password",
        });
      }

      let token = await generateJsonWebToken(user.profileid);

      res.json({
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
    } else if (validatedVendorEmail.length != 0) {
      const user = validatedVendorEmail[0];

      if (password != user.password) {
        return res.status(401).json({
          resp: false,
          msg: "Wrong Password",
        });
      }

      let vendorid = user.vendorid;
      let activated = user.activated;
      let remark = user.remark;
      let token = await generateJsonWebToken(vendorid);

      if (activated == 0) {
        if (vendorid) {
          execute(
            `UPDATE vendor SET login_type=1 WHERE vendorid='${vendorid}'`
          );
          return res.json({
            resp: true,
            msg: "Login SuccessFull",
            user: {
              uid: user.id,
              firstName: user.firstname,
              image: user.shopphoto,
              email: user.email,
              mainId: user.vendorid,
              type:
                user.category == "buy-a-product"
                  ? "product_vendor"
                  : user.category == "book-a-services"
                  ? "service_vendor"
                  : "product_vendor",
            },
            token,
          });
        } else {
          return res.status(401).json({
            resp: false,
            msg: "Wrong Password",
          });
        }
      }
      if (activated == 1) {
        if (vendorid) {
          execute(
            `UPDATE vendor SET login_type=1 WHERE vendorid='${vendorid}'`
          );
          return res.json({
            resp: true,
            msg: "Login SuccessFull",
            user: {
              uid: user.id,
              firstName: user.firstname,
              image: user.shopphoto,
              email: user.email,
              mainId: user.vendorid,
              type:
                user.category == "buy-a-product"
                  ? "product_vendor"
                  : user.category == "book-a-services"
                  ? "service_vendor"
                  : "product_vendor",
            },
            token,
          });
        } else {
          return res.status(401).json({
            resp: false,
            msg: "Wrong Password",
          });
        }
      }
      if (activated == 2) {
        if (vendorid) {
          execute(
            `UPDATE vendor SET login_type=1 WHERE vendorid='${vendorid}'`
          );
          return res.json({
            resp: true,
            msg: "Login SuccessFull",
            user: {
              uid: user.id,
              firstName: user.firstname,
              image: user.shopphoto,
              email: user.email,
              mainId: user.vendorid,
              type:
                user.category == "buy-a-product"
                  ? "product_vendor"
                  : user.category == "book-a-services"
                  ? "service_vendor"
                  : "product_vendor",
            },
            token,
          });
        } else {
          return res.status(401).json({
            resp: false,
            msg: "Wrong Password",
          });
        }
      }
      if (activated == 3) {
        return res.status(401).json({
          resp: false,
          msg: `Your Account is Cancelled...${remark}`,
        });
      }
    }
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const renewTokenLogin = async (req, res = response) => {
  try {
    const token = await generateJsonWebToken(req.uid);

    const userdb = await pool.query(`CALL SP_RENEWTOKENLOGIN(?);`, [req.uid]);

    const user = userdb[0][0];

    res.json({
      resp: true,
      msg: "Welcome to Frave Restaurant",
      user: {
        uid: user.uid,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        phone: user.phone,
        email: user.email,
        rol_id: user.rol_id,
        notification_token: user.notification_token,
      },
      token,
    });
  } catch (e) {
    res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

async function execute(query) {
  try {
    await pool.query(query);
    return true;
  } catch (error) {
    console.log("Error: cannot execute the command");
    return false;
  }
}

export const product_vendor_loginController = async (req, res = response) => {
  try {
    const { email, password } = req.body;

    const validatedEmail = await pool.query(
      `SELECT * FROM vendor WHERE email='${email}' OR phone='${email}' and password='${password}' and status=1`
    );

    if (validatedEmail.length == 0) {
      return res.status(400).json({
        resp: false,
        msg: "Wrong Credentials",
      });
    }

    const user = validatedEmail[0];

    if (password != user.password) {
      return res.status(401).json({
        resp: false,
        msg: "Wrong Password",
      });
    }

    let vendorid = user.vendorid;
    let activated = user.activated;
    let remark = user.remark;
    let token = await generateJsonWebToken(vendorid);

    if (activated == 0) {
      if (vendorid) {
        execute(`UPDATE vendor SET login_type=1 WHERE vendorid='${vendorid}'`);
        return res.json({
          resp: true,
          msg: "Login SuccessFull",
          user: {
            uid: user.id,
            firstName: user.name,
            image: user.shopphoto,
            email: user.email,
            vendorid: user.vendorid,
          },
          token,
        });
      } else {
        return res.status(401).json({
          resp: false,
          msg: "Wrong Password",
        });
      }
    }
    if (activated == 1) {
      if (vendorid) {
        execute(`UPDATE vendor SET login_type=1 WHERE vendorid='${vendorid}'`);
        return res.json({
          resp: true,
          msg: "Login SuccessFull",
          user: {
            uid: user.id,
            firstName: user.name,
            image: user.shopphoto,
            email: user.email,
            vendorid: user.vendorid,
          },
          token,
        });
      } else {
        return res.status(401).json({
          resp: false,
          msg: "Wrong Password",
        });
      }
    }
    if (activated == 2) {
      if (vendorid) {
        execute(`UPDATE vendor SET login_type=1 WHERE vendorid='${vendorid}'`);
        return res.json({
          resp: true,
          msg: "Login SuccessFull",
          user: {
            uid: user.id,
            firstName: user.name,
            image: user.shopphoto,
            email: user.email,
            vendorid: user.vendorid,
          },
          token,
        });
      } else {
        return res.status(401).json({
          resp: false,
          msg: "Wrong Password",
        });
      }
    }
    if (activated == 3) {
      return res.status(401).json({
        resp: false,
        msg: `Your Account is Cancelled...${remark}`,
      });
    }
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const getUserbyid = async (req, res = response) => {
  try {
    const { user_id } = req.body;

    const validatedUserEmail = await pool.query(
      `SELECT * FROM users WHERE profileid='${user_id}' and status=1`
    );

    const validatedVendorEmail = await pool.query(
      `SELECT * FROM vendor WHERE vendorid='${user_id}'and status=1`
    );

    if (validatedUserEmail.length != 0) {
      const user = validatedUserEmail[0];

      let token = await generateJsonWebToken(user.profileid);

      res.json({
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
    } else if (validatedVendorEmail.length != 0) {
      const user = validatedVendorEmail[0];

      let vendorid = user.vendorid;
      let activated = user.activated;
      let remark = user.remark;
      let token = await generateJsonWebToken(vendorid);

      if (activated == 0) {
        if (vendorid) {
          execute(
            `UPDATE vendor SET login_type=1 WHERE vendorid='${vendorid}'`
          );
          return res.json({
            resp: true,
            msg: "Login SuccessFull",
            user: {
              uid: user.id,
              firstName: user.name,
              image: user.shopphoto,
              email: user.email,
              mainId: user.vendorid,
              type: "vendor",
            },
            token,
          });
        } else {
          return res.status(401).json({
            resp: false,
            msg: "Wrong Password",
          });
        }
      }
      if (activated == 1) {
        if (vendorid) {
          execute(
            `UPDATE vendor SET login_type=1 WHERE vendorid='${vendorid}'`
          );
          return res.json({
            resp: true,
            msg: "Login SuccessFull",
            user: {
              uid: user.id,
              firstName: user.name,
              image: user.shopphoto,
              email: user.email,
              mainId: user.vendorid,
              type: "vendor",
            },
            token,
          });
        } else {
          return res.status(401).json({
            resp: false,
            msg: "Wrong Password",
          });
        }
      }
      if (activated == 2) {
        if (vendorid) {
          execute(
            `UPDATE vendor SET login_type=1 WHERE vendorid='${vendorid}'`
          );
          return res.json({
            resp: true,
            msg: "Login SuccessFull",
            user: {
              uid: user.id,
              firstName: user.name,
              image: user.shopphoto,
              email: user.email,
              mainId: user.vendorid,
              type: "vendor",
            },
            token,
          });
        } else {
          return res.status(401).json({
            resp: false,
            msg: "Wrong Password",
          });
        }
      }
      if (activated == 3) {
        return res.status(401).json({
          resp: false,
          msg: `Your Account is Cancelled...${remark}`,
        });
      }
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};
