import { response } from "express";
import pool from "../Database/mysql.js";

export const addNewOrders = async (req, res = response) => {
  try {
    const { serviceid, service, servicename, price, profileid, vendorid } =
      req.body;

    const insertcart = `SELECT * FROM cart WHERE serviceid='${serviceid}' and profileid='${profileid}' and status=0 and vendorid='${vendorid}'`;

    pool
      .query(insertcart)
      .then((run) => {
        if (serviceid == Number(run[0]?.serviceid)) {
          const putincart = `UPDATE cart SET quantity='1',subtotal='${
            price * 1
          }' WHERE serviceid='${serviceid}' and profileid='${profileid}' and status=0 and vendorid='${vendorid}'`;
          pool.query(putincart).then((run) => {
            console.log(run);
            return res.json({
              resp: true,
              msg: "Item added successfully",
            });
          });
        } else {
          const putincart = `INSERT INTO cart (serviceid,service,servicename,price,quantity,subtotal,profileid,vendorid,status) VALUES ('${serviceid}','${service}','${servicename}','${price}','1','${
            price * 1
          }','${profileid}','${vendorid}','0')`;
          pool.query(putincart).then((run) => {
            console.log(run);
            return res.json({
              resp: true,
              msg: "Item added successfully",
            });
          });
        }
      })

      .catch((error) => {
        console.log(error);
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

export const book_Services = async (req, res = response) => {
  try {
    const {
      vendorid,
      profileid,
      total,
      walletamount,
      totalamount,
      seatnumber,
      slotdate,
      slottime,
    } = req.body;

    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const amOrPm = now.getHours() < 12 ? "AM" : "PM";
    const randomInt = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

    const bookingid = "JDB" + randomInt;
    const invoicenumber =
      Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    const date = new Date().toISOString().slice(0, 10);
    const time = `${hours}:${minutes} ${amOrPm}`;
    const status = 1;
    const remark = null;
    const counter = 1;
    const bookingstatus = 1;
    const paymentmethod = 1;
    const bookingfee = "free";
    const cartcatidquery = await pool.query(
      `SELECT * FROM cart WHERE profileid='${profileid}' and status=0 and vendorid='${vendorid}'`
    );
    const validatedUserEmail = await pool.query(
      `SELECT * FROM users WHERE profileid='${profileid}' and status=1`
    );
    const user = validatedUserEmail[0];

    const query1 = `INSERT INTO booking (name,phone,email,cartid,total,bookingfee,walletamount,totalamount,seatnumber,slotdate,slottime,paymentmethod,profileid,vendorid,bookingid,invoicenumber,date,time,status,remark,counter,bookingstatus) VALUES('${user.name}','${user.phone}','${user.email}','${cartcatidquery[0].id}','${total}','${bookingfee}','${walletamount}','${totalamount}','${seatnumber}','${slotdate}','${slottime}','${paymentmethod}','${profileid}','${vendorid}','${bookingid}','${invoicenumber}','${date}','${time}','${status}','${remark}','${counter}','${bookingstatus}')`;
    const query2 = `UPDATE cart SET status=1 WHERE profileid='${profileid}' and id='${cartcatidquery[0].id}'`;

    pool
      .query(query1)
      .then((e) => {
        return pool.query(query2);
      })
      .then((run) => {
        res.json({
          resp: true,
          msg: `Booked Successfully`,
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

export const getOrdersByStatus = async (req, res = response) => {
  try {
    const ordersdb = await pool.query(`CALL SP_ALL_ORDERS_STATUS(?);`, [
      req.params.statusOrder,
    ]);

    res.json({
      resp: true,
      msg: "Orders by " + req.params.statusOrder,
      ordersResponse: ordersdb[0],
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const getDetailsOrderById = async (req, res = response) => {
  try {
    const detailOrderdb = await pool.query(`CALL SP_ORDER_DETAILS(?);`, [
      req.params.idOrderDetails,
    ]);

    res.json({
      resp: true,
      msg: "Order details by " + req.params.idOrderDetails,
      detailsOrder: detailOrderdb[0],
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const updateStatusToDispatched = async (req, res = response) => {
  try {
    const { idDelivery, idOrder } = req.body;

    await pool.query(
      "UPDATE orders SET status = ?, delivery_id = ? WHERE id = ?",
      ["DISPATCHED", idDelivery, idOrder]
    );

    res.json({
      resp: true,
      msg: "Order DISPATCHED",
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const getOrdersByDelivery = async (req, res = response) => {
  try {
    const ordersDeliverydb = await pool.query(
      `CALL SP_ORDERS_BY_DELIVERY(?,?);`,
      [req.uid, req.params.statusOrder]
    );

    res.json({
      resp: true,
      msg: "All Orders By Delivery",
      ordersResponse: ordersDeliverydb[0],
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const updateStatusToOntheWay = async (req, res = response) => {
  try {
    const { latitude, longitude } = req.body;

    await pool.query(
      "UPDATE orders SET status = ?, latitude = ?, longitude = ? WHERE id = ?",
      ["ON WAY", latitude, longitude, req.params.idOrder]
    );

    res.json({
      resp: true,
      msg: "ON WAY",
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const updateStatusToDelivered = async (req, res = response) => {
  try {
    await pool.query("UPDATE orders SET status = ? WHERE id = ?", [
      "DELIVERED",
      req.params.idOrder,
    ]);

    res.json({
      resp: true,
      msg: "ORDER DELIVERED",
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};
