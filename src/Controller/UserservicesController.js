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

export const servicesvendorcontroller = async (req, res = response) => {
  try {
    const { cityid, areaid, mainid } = req.body;
    const query =
      "SELECT * FROM vendor WHERE status=1 and category='book-a-services' and activated=1 and city='" +
      cityid +
      "' and area='" +
      areaid +
      "' and maincategory LIKE '%" +
      mainid +
      "%' ORDER BY id ASC";
    getData(query)
      .then((run) => {
        if (run.length != 0) {
          // {
          //   id: run.vendorid,
          //   BussinessName: run.businessname,
          //   BusinessAddress: run.address,
          //   landmark: run.landmark,
          //   image: run.shopphoto,
          // }
          res.json({
            resp: true,
            msg: "Got Vendors SuccessFull",
            vendors: run,
          });
        } else {
          res.json({
            resp: false,
            msg: "No vendor Found",
            vendors: run,
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
    const { vendorid } = req.body;
    const vendorquery = `SELECT * FROM vendor WHERE vendorid='${vendorid}'`;
    const categoryquery = `SELECT * FROM main_category WHERE pid='2' ORDER BY id DESC`;
    const maincat = await getData(vendorquery).then((d) => {
      return d[0].maincategory;
    });
    const cat = maincat;
    const catarray = cat.split(",");

    const reqcat = await getData(categoryquery).then((row) => {
      return row;
    });

    res.json({
      resp: true,
      msg: "Got Services SuccessFull",
      services: reqcat.filter((i) => catarray.includes(i.id.toString())),
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

// export const available_bookingtime = async (req, res = response) => {
//   try {
//     const { vendorid } = req.body;
//     const alltimings = `SELECT * FROM bookingtime WHERE status=1 ORDER BY id ASC`;
//     const previousbookings = `SELECT * FROM booking WHERE slottime='${row[id]}' and slotdate='${slotdate}' and seatnumber='${seatnumber}' and vendorid='${vendorid}'`;
//     const query = `SELECT * FROM availableseat WHERE vendorid='${vendorid}' and status=1 ORDER BY id ASC`;
//     getData(query)
//       .then((run) => {
//         if (run.length != 0) {
//           res.json({
//             resp: true,
//             msg: "Got Services SuccessFull",
//             cities: run,
//           });
//         } else {
//           res.json({
//             resp: false,
//             msg: "No Service Found",
//             cities: run,
//           });
//         }
//       })
//       .catch((error) => {
//         return res.status(401).json({
//           resp: false,
//           msg: error,
//         });
//       });
//   } catch (e) {
//     return res.status(500).json({
//       resp: false,
//       msg: e,
//     });
//   }
// };
export const service_cart = async (req, res = response) => {
  try {
    const { vendorid, profileid } = req.body;
    const query = `SELECT * FROM cart WHERE profileid='${profileid}' and status=0 and vendorid='${vendorid}'`;
    getData(query)
      .then((run) => {
        if (run.length != 0) {
          res.json({
            resp: true,
            msg: "Got cart SuccessFull",
            cart: run,
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
