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

export const servicepageslider = async (req, res = response) => {
  try {
    const query = `SELECT * FROM slider WHERE status=1 ORDER BY id DESC`;
    getData(query)
      .then((run) => {
        if (run.length != 0) {
          res.json({
            resp: true,
            msg: "Got Services SuccessFull",
            services: run,
          });
        } else {
          res.json({
            resp: false,
            msg: "No service Found",
            services: run,
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
export const mainservicescontroller = async (req, res = response) => {
  try {
    const query = `SELECT * FROM main_category WHERE status=1 and pid=2 ORDER BY id ASC`;
    getData(query)
      .then((run) => {
        if (run.length != 0) {
          res.json({
            resp: true,
            msg: "Got Services SuccessFull",
            services: run,
          });
        } else {
          res.json({
            resp: false,
            msg: "No service Found",
            services: run,
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

//all vendor listning
export const servicesvendorcontroller = async (req, res = response) => {
  try {
    const { cityid, areaid, mainid, profileid } = req.body;
    const query =
      "SELECT * FROM vendor WHERE status = 1 " +
      "AND category = 'book-a-services' " +
      "AND activated = 1 " +
      `AND city = '${cityid}' ` +
      // `AND area = '${areaid}' ` +
      `AND maincategory LIKE CONCAT('%', '${mainid}', '%') ` +
      "ORDER BY id ASC";
    getData(query, { $cityid: cityid, $areaid: areaid, $mainid: mainid })
      .then((vendors) => {
        if (vendors.length > 0) {
          const promises = vendors.map((vendor) => {
            return getData(
              `SELECT * FROM likes WHERE vendorid = '${vendor.vendorid}' AND profileid = '${profileid}'`
            ).then((likes) => {
              vendor.liked = likes.length > 0;
              return vendor;
            });
          });
          Promise.all(promises).then((vendorsWithLikes) => {
            res.json({
              resp: true,
              msg: "Got Vendors Successfully",
              vendors: vendorsWithLikes,
            });
          });
        } else {
          res.json({
            resp: false,
            msg: "No Vendors Found",
            vendors: [],
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

export const servicesvendorbylocationcontroller = async (
  req,
  res = response
) => {
  try {
    const { pincode, mainid, profileid } = req.body;
    const query =
      "SELECT * FROM vendor WHERE status = 1 " +
      "AND category = 'book-a-services' " +
      "AND activated = 1 " +
      `AND pincode = '${pincode}' ` +
      `AND maincategory LIKE CONCAT('%', '${mainid}', '%') ` +
      "ORDER BY id ASC";
    getData(query, { $pincode: pincode, $mainid: mainid })
      .then((vendors) => {
        if (vendors.length > 0) {
          const promises = vendors.map((vendor) => {
            return getData(
              `SELECT * FROM likes WHERE vendorid = '${vendor.vendorid}' AND profileid = '${profileid}'`
            ).then((likes) => {
              vendor.liked = likes.length > 0;
              return vendor;
            });
          });
          Promise.all(promises).then((vendorsWithLikes) => {
            res.json({
              resp: true,
              msg: "Got Vendors Successfully",
              vendors: vendorsWithLikes,
            });
          });
        } else {
          res.json({
            resp: false,
            msg: "No Vendors Found",
            vendors: [],
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

export const servicedetail_categories = async (req, res = response) => {
  try {
    const { vendorid, profileid } = req.body;
    const vendorquery = `SELECT * FROM vendor WHERE vendorid='${vendorid}'`;
    const categoryquery = `SELECT * FROM main_category WHERE pid='2' ORDER BY id DESC`;
    const seatesquery = `SELECT * FROM availableseat WHERE vendorid='${vendorid}' and status=1 ORDER BY id ASC`;
    const bannerquery = `SELECT * FROM vendorbanners WHERE vendorid='${vendorid}' and status=1 ORDER BY id DESC`;
    const maincat = await getData(vendorquery).then((d) => {
      return d[0].maincategory;
    });
    const cat = maincat;
    const catarray = cat.split(",");

    const reqcat = await getData(categoryquery).then((row) => {
      return row;
    });

    const liked = await getData(
      `SELECT * FROM likes WHERE vendorid = '${vendorid}' AND profileid = '${profileid}'`
    ).then((row) => {
      return row;
    });

    const seats = await getData(seatesquery).then((row) => {
      return row;
    });
    const banners = await getData(bannerquery).then((row) => {
      return row;
    });
    console.log();
    // const cancelled_price = [...cancelled];

    res.json({
      resp: true,
      msg: "Got Services SuccessFull",
      services: reqcat.filter((i) => catarray.includes(i.id.toString())),
      liked: liked.length != 0 ? true : false,
      seats: seats.map((e) => {
        return e;
      }),
      banner: banners.map((e) => {
        return e;
      }),
      // .map((v) => {
      //   return { id: v.id };
      // }),
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const vendor_services = async (req, res = response) => {
  try {
    const { mainid, vendorid } = req.body;
    const query = `SELECT * FROM services WHERE maincategory='${mainid}' and category='2' and vendorid='${vendorid}'`;
    getData(query)
      .then((run) => {
        if (run.length != 0) {
          res.json({
            resp: true,
            msg: "Got Services SuccessFull",
            services: run,
          });
        } else {
          res.json({
            resp: false,
            msg: "No Service Found",
            services: run,
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

export const available_seates = async (req, res = response) => {
  try {
    const { vendorid } = req.body;
    const query = `SELECT * FROM availableseat WHERE vendorid='${vendorid}' and status=1 ORDER BY id ASC`;
    getData(query)
      .then((run) => {
        if (run.length != 0) {
          res.json({
            resp: true,
            msg: "Got Services SuccessFull",
            cities: run,
          });
        } else {
          res.json({
            resp: false,
            msg: "No Service Found",
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

export const service_cart = async (req, res = response) => {
  try {
    const { vendorid, profileid } = req.body;
    const query = `SELECT * FROM cart WHERE profileid='${profileid}' and status=0 and vendorid='${vendorid}'`;
    const totalquantity = `SELECT sum(quantity) as quantity FROM cart WHERE profileid='${profileid}' and status=0 and vendorid='${vendorid}'`;
    const totalprice = `SELECT sum(subtotal) as subtotal FROM cart WHERE profileid='${profileid}' and status=0 and vendorid='${vendorid}'`;
    const validatedUserEmail = await pool.query(
      `SELECT * FROM users WHERE profileid='${profileid}' and status=1`
    );
    const user = validatedUserEmail[0];

    const quantityquery = await getData(totalquantity).then((row) => {
      return row;
    });
    const mainquan = [...quantityquery];
    const pricequery = await getData(totalprice).then((row) => {
      return row;
    });
    const mainprice = [...pricequery];

    getData(query)
      .then((run) => {
        if (run.length != 0) {
          res.json({
            resp: true,
            msg: "Got cart SuccessFull",
            cart: run,
            quantity: mainquan[0].quantity,
            price: mainprice[0].subtotal,
            wallet: user.wallets,
          });
        } else {
          res.json({
            resp: false,
            msg: "No cart Found",
            cart: run,
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

export const mainservicepage = async (req, res = response) => {
  try {
    pool.query(
      "SELECT * FROM categories WHERE category=1 and status=1",
      (error, rr, fields) => {
        if (error) {
          console.error(error);
          return;
        }

        const responseData = [];

        // Iterate through the results and execute Query 2 for each element
        rr.forEach((row) => {
          const id = row.id;
          const name = row.name;

          // Query 2: Use the ID from Query 1 to get data from the second table
          pool.query(
            `SELECT * FROM configue_package WHERE categories='${id}' and status=1 ORDER BY id DESC`,
            (error, results, fields) => {
              if (error) {
                console.error(error);
                return;
              }

              responseData.push({ id: id, name: name, data: results });

              // If all queries have been completed, send the response
              if (responseData.length === rr.length) {
                res.json({
                  resp: true,
                  msg: "Got Services SuccessFull",
                  services: responseData,
                });
              }
            }
          );
        });
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const getalltimings = async (req, res = response) => {
  try {
    const { vendorid, slot_date, seat_no } = req.body;
    const vendorquery = `SELECT * FROM booking WHERE  slotdate='${slot_date}' and seatnumber='${seat_no}' and vendorid='${vendorid}' `;
    // slottime='$row[id]' and
    const vendordb = await getData(vendorquery).then((row) => {
      return row;
    });

    let alldb = [...vendordb];

    const givenvalue = (i) =>
      alldb.filter((a) => {
        return i == a.slottime;
      });

    const insertcart =
      "SELECT * FROM bookingtime WHERE status=1 ORDER BY id ASC";

    pool
      .query(insertcart)
      .then((run) => {
        return res.json({
          resp: true,

          msg: run.map((data) => {
            return {
              id: data.id,
              name: data.name,
              time: data.time,
              date: data.date,
              alreadybooked: givenvalue(data.id)[0] ? true : false,
            };
          }),
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

//get  all servicees bookings
export const get_all_service_bookings = async (req, res = response) => {
  try {
    const { profileid } = req.body;

    const select = `SELECT * FROM booking WHERE profileid='${profileid}' ORDER BY id DESC`;

    pool
      .query(select, (error, rr, fields) => {
        if (error) {
          console.error(error);
          return;
        }

        const responseData = [];

        // Iterate through the results and execute Query 2 for each element
        rr.forEach((row) => {
          pool.query(
            `SELECT * FROM vendor WHERE vendorid='${row.vendorid}'`,
            (error, results, fields) => {
              if (error) {
                console.error(error);
                return;
              }

              pool.query(
                `SELECT * FROM availableseat WHERE id='${row.seatnumber}' and vendorid='${row.vendorid}' and status=1`,
                (error, lastr, fields) => {
                  if (error) {
                    console.error(error);
                    return;
                  }

                  responseData.push({
                    bookingid: row.bookingid,
                    name: row.name,
                    seat_no: lastr[0]?.seatname,
                    slotdate: row.slotdate,
                    paymentmethod:
                      row.paymentmethod == 1
                        ? "Pay After Booking"
                        : "Pay Before Booking",
                    invoice: row.invoicenumber,
                    shopno: results[0]?.businessname,
                    Status: row.status,
                    date: row.date,
                    time: row.time,
                  });
                  if (responseData.length === rr.length) {
                    res.json({
                      resp: true,
                      msg: "Got Details SuccessFull",
                      services: responseData,
                    });
                  }
                }
              );
            }
          );
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

export const get_service_bookings_detail = async (req, res = response) => {
  try {
    const { bookingid } = req.body;

    const select = `SELECT * FROM booking WHERE bookingid='${bookingid}' `;

    pool
      .query(select, (error, rr, fields) => {
        if (error) {
          console.error(error);
          return;
        }

        const responseData = [];

        // Iterate through the results and execute Query 2 for each element
        rr.forEach((row) => {
          pool.query(
            `SELECT * FROM vendor WHERE vendorid='${row.vendorid}'`,
            (error, results, fields) => {
              if (error) {
                console.error(error);
                return;
              }

              pool.query(
                `SELECT * FROM availableseat WHERE id='${row.seatnumber}' and vendorid='${row.vendorid}' and status=1`,
                (error, lastr, fields) => {
                  if (error) {
                    console.error(error);
                    return;
                  }
                  pool.query(
                    `SELECT * FROM bookingtime WHERE id='${row.slottime}' and status=1`,
                    (error, booktime, fields) => {
                      if (error) {
                        console.error(error);
                        return;
                      }
                      pool.query(
                        `SELECT * FROM cart WHERE profileid='${row.profileid}' and id='${row.cartid}' and status=1`,
                        (error, cart, fields) => {
                          if (error) {
                            console.error(error);
                            return;
                          }
                          pool.query(
                            `SELECT * FROM user_address WHERE addressid='${row.address}' and profileid='${row.profileid}'`,
                            (error, addrs, fields) => {
                              if (error) {
                                console.error(error);
                                return;
                              }

                              responseData.push({
                                name: row.name,
                                email: row.email,
                                phone: row.phone,
                                address: addrs,
                                bookingtime: booktime[0]?.name,
                                slotdate: row.slotdate,

                                paymentmethod:
                                  row.paymentmethod == 1
                                    ? "Pay After Booking"
                                    : "Pay Before Booking",
                                status: row.status,

                                cart: cart,
                                total: row.total,
                                walletamount: row.walletamount,
                                bookingfee: "Free",
                                totalamount: row.totalamount,
                                vendorimage: results[0]?.shopphoto,
                                vendorname: results[0]?.businessname,
                                vendoraddress: results[0]?.address,
                                vendoremail: results[0]?.email,
                                vendorphone: results[0]?.phone,

                                seat_name: lastr[0]?.seatname,
                                seat_image: lastr[0]?.image,

                                date: row.date,
                                time: row.time,
                              });
                              if (responseData.length === rr.length) {
                                res.json({
                                  resp: true,
                                  msg: "Got Details SuccessFull",
                                  services: responseData[0],
                                });
                              }
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
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

export const deleteUserService = async (req, res = response) => {
  try {
    await pool.query("DELETE FROM cart WHERE id = ?", [req.body.cartid]);

    res.json({
      resp: true,
      msg: "Service Removed",
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

//all vendor listning
export const searchvendorcontroller = async (req, res = response) => {
  try {
    const { vendorname, profileid } = req.body;
    const query =
      `SELECT * FROM vendor WHERE businessname LIKE '%${vendorname}%' ` +
      "ORDER BY id ASC";
    getData(query)
      .then((vendors) => {
        if (vendors.length > 0) {
          const promises = vendors.map((vendor) => {
            return getData(
              `SELECT * FROM likes WHERE vendorid = '${vendor.vendorid}' AND profileid = '${profileid}'`
            ).then((likes) => {
              vendor.liked = likes.length > 0;
              return vendor;
            });
          });
          Promise.all(promises).then((vendorsWithLikes) => {
            res.json({
              resp: true,
              msg: "Got Vendors Successfully",
              vendors: vendorsWithLikes,
            });
          });
        } else {
          res.json({
            resp: false,
            msg: "No Vendors Found",
            vendors: [],
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

export const vendor_reviews = async (req, res = response) => {
  try {
    const { vendorid } = req.body;
    const query = `SELECT * FROM vendorreview WHERE vendorid='${vendorid}' and status=1`;
    getData(query)
      .then((run) => {
        if (run.length != 0) {
          res.json({
            resp: true,
            msg: "Got Reviews SuccessFull",
            reviews: run,
          });
        } else {
          res.json({
            resp: false,
            msg: "No Review Found",
            reviews: run,
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

export const submitnewservicereview = async (req, res = response) => {
  try {
    const { vendorid, vendortype, rating, name, message, profileid } = req.body;
    const options = { timeZone: "Asia/Kolkata" };

    // Get the current date and time
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", options);
    const formattedTime = date.toLocaleTimeString("en-US", options);

    await pool
      .query(
        `INSERT INTO vendorreview (vendorid,vendortype,rating,name,message,date,time,profileid,status) VALUES ('${vendorid}','${vendortype}','${rating}','${name}','${message}','${formattedDate}','${formattedTime}','${profileid}','1')`
      )
      .then((run) => {
        res.json({
          resp: true,
          msg: "Review Submitted",
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
