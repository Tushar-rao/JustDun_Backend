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
          referId: user.jdbdid,
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
              referId: user.refferalcode,
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
              referId: user.refferalcode,
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
              referId: user.refferalcode,
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
      message: { msg: e },
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
    console.log(e);
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
          phone: user.phone,
          address: user.address,
          pincode: user.pincode,
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
              phone: user.phone,
              address: user.address,
              pincode: user.pincode,
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
              phone: user.phone,
              address: user.address,
              pincode: user.pincode,
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
              phone: user.phone,
              address: user.address,
              pincode: user.pincode,
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

export const update_profile = async (req, res = response) => {
  try {
    const { name, email, phone, pincode, address, profileid } = req.body;
    const select = `UPDATE users SET name='${name}',email='${email}',phone='${phone}',pincode='${pincode}',address='${address}' WHERE profileid='${profileid}'`;

    pool
      .query(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: `Updated Successfully`,
        });
      })
      .catch((error) => {
        return res.status(401).json({
          resp: false,
          msg: "Something Went Wrong",
        });
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      resp: false,
      msg: "Please try later",
    });
  }
};
export const update_password = async (req, res = response) => {
  try {
    const { newpassword, profileid } = req.body;
    const select = `UPDATE users SET password='${newpassword}' WHERE profileid='${profileid}'`;

    pool
      .query(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: `Updated Successfully`,
        });
      })
      .catch((error) => {
        return res.status(401).json({
          resp: false,
          msg: "Something Went Wrong",
        });
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      resp: false,
      msg: "Please try later",
    });
  }
};

export const getuser_address = async (req, res = response) => {
  try {
    const { profileid } = req.body;
    const select = `SELECT * FROM user_address WHERE profileid='${profileid}'`;

    pool
      .query(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: `Updated Successfully`,
          data: run,
        });
      })
      .catch((error) => {
        return res.status(401).json({
          resp: false,
          msg: "Something Went Wrong",
        });
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      resp: false,
      msg: "Please try later",
    });
  }
};

export const getuser_default_address = async (req, res = response) => {
  try {
    const { profileid } = req.body;
    const select = `SELECT * FROM user_address WHERE defaultaddress='0' AND profileid='${profileid}'`;

    pool
      .query(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: `Updated Successfully`,
          data: run,
        });
      })
      .catch((error) => {
        return res.status(401).json({
          resp: false,
          msg: "Something Went Wrong",
        });
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      resp: false,
      msg: "Please try later",
    });
  }
};

export const create_new_address = async (req, res = response) => {
  try {
    const {
      fullname,
      mobilenumber,
      addressnickname,
      pincode,
      address,
      landmark,
      state,
      city,
      addresstype,
      defaultaddress,

      profileid,
    } = req.body;
    const addressid = "ADD" + Math.floor(Math.random() * 9000 + 1000);

    const select = `INSERT INTO user_address (fullname,mobilenumber,addressnickname,pincode,address,landmark,state,city,addresstype,defaultaddress,addressid,profileid) VALUES ('${fullname}','${mobilenumber}','${addressnickname}','${pincode}','${address}','${landmark}','${state}','${city}','${addresstype}','${defaultaddress}','${addressid}','${profileid}')`;
    if (defaultaddress == 1) {
      await pool.query(
        `UPDATE user_address SET defaultaddress='0' WHERE profileid='${profileid}'`
      );
    }
    pool
      .query(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: `Added Successfully`,
        });
      })
      .catch((error) => {
        return res.status(401).json({
          resp: false,
          msg: "Something Went Wrong",
        });
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      resp: false,
      msg: "Please try later",
    });
  }
};

export const update_my_address = async (req, res = response) => {
  try {
    const {
      fullname,
      mobilenumber,
      addressnickname,
      pincode,
      address,
      landmark,
      state,
      city,
      addresstype,
      defaultaddress,
      addid,
      profileid,
    } = req.body;

    const select = `UPDATE user_address SET fullname='${fullname}',mobilenumber='${mobilenumber}',addressnickname='${addressnickname}',pincode='${pincode}',address='${address}',landmark='${landmark}',state='${state}',city='${city}',addresstype='${addresstype}',defaultaddress='${defaultaddress}' WHERE id='${addid}'`;
    if (defaultaddress == 1) {
      await pool.query(
        `UPDATE user_address SET defaultaddress='0' WHERE profileid='${profileid}'`
      );
    }
    pool
      .query(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: `Updated Successfully`,
        });
      })
      .catch((error) => {
        return res.status(401).json({
          resp: false,
          msg: "Something Went Wrong",
        });
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      resp: false,
      msg: "Please try later",
    });
  }
};

export const delete_user_address = async (req, res = response) => {
  try {
    const { addid } = req.body;
    const select = `DELETE FROM user_address WHERE id='${addid}'`;

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
          msg: "Something Went Wrong",
        });
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      resp: false,
      msg: "Please try later",
    });
  }
};

export const getuser_old_pass = async (req, res = response) => {
  try {
    const { profileid } = req.body;

    const select = `SELECT * FROM users WHERE profileid='${profileid}'`;
    const validatedVendorEmail = await pool.query(select);

    res.json({
      resp: true,
      msg: `Updated Successfully`,
      data: validatedVendorEmail[0],
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      resp: false,
      msg: "Please try later",
    });
  }
};

export const getvendorscanner = async (req, res = response) => {
  try {
    const { vendor_id } = req.body;

    const select = `SELECT * FROM vendor WHERE vendorid='${vendor_id}'and status=1`;
    const validatedVendorEmail = await pool.query(select);

    res.json({
      resp: true,
      msg: `Got Vendor Successfully`,
      data: validatedVendorEmail[0],
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      resp: false,
      msg: "Please try later",
    });
  }
};

export const delete_user = async (req, res = response) => {
  try {
    const { userId } = req.body;
    const select = `DELETE FROM users WHERE profileid='${userId}'`;

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
          msg: "Something Went Wrong",
        });
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      resp: false,
      msg: "Please try later",
    });
  }
};

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

export const loginpagemediacontroller = async (req, res = response) => {
  try {
    const select = "SELECT * FROM `appmedia` ORDER BY `category` ASC";

    getData(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: "Got Data",
          media: run,
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

export const getUserNotification = async (req, res = response) => {
  try {
    const { profileid } = req.body;
    const visitnotifications = await pool.query(
      `SELECT * FROM visitnotify WHERE profileid='${profileid}' and status=1`
    );
    const notificationIDs = visitnotifications.map(
      (visitnotification) => visitnotification.notify_id
    );
    const notifications = await pool.query(
      `SELECT * FROM notifications WHERE account_type='users' AND status=1 AND account_id LIKE '%${profileid}%' AND notify_id IN (${notificationIDs}) ORDER BY id DESC`
    );

    res.json({
      resp: true,
      msg: "User Notifications",
      notifications: notifications,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      resp: false,
      msg: e.message,
    });
  }
};

export const create_new_enquiry = async (req, res = response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const currentDate = new Date();
    const date = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const formattedDate = `${date}/${month}/${year}`;

    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    const select = `INSERT INTO contact_enquiry (name,email,phone,subject,message,date,time) VALUES('${name}','${email}','${phone}','${subject}','${message}','${formattedDate}','${formattedTime}')`;

    pool
      .query(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: `Submitted Successfully`,
        });
      })
      .catch((error) => {
        return res.status(401).json({
          resp: false,
          msg: "Something Went Wrong",
        });
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      resp: false,
      msg: "Please try later",
    });
  }
};
