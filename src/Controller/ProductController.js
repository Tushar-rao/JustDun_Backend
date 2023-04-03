import { response } from "express";
import pool from "../Database/mysql.js";

export const getproducthomescreen = async (req, res = response) => {
  try {
    const { name, description, price, category } = req.body;

    const select = `SELECT * FROM products WHERE maincategoryid='$maincatid' and categoryid='$catid' and status=1 ORDER BY id DESC LIMIT $offset, $total_records_per_page`;

    pool
      .query(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: "Got data SuccessFull",
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

//top banner
export const product_screen_banner = async (req, res = response) => {
  try {
    const { catid } = req.body;

    const select = `SELECT * FROM categoryslider WHERE pid='${catid}' ORDER BY id DESC`;

    pool
      .query(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: "Got Category SuccessFull",
          data: run,
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

//top slider all categories
export const getproduct_main_categories = async (req, res = response) => {
  try {
    const { catid } = req.body;
    const select = `SELECT * FROM main_category WHERE cat='Retailor' and maincat='${catid}' and pid='1' and status=1 ORDER BY id ASC`;

    pool
      .query(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: "Got data SuccessFull",
          data: run,
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

//dropdown functions
export const select_product_main = async (req, res = response) => {
  try {
    const { catid } = req.body;

    const select = `SELECT * FROM sub_category WHERE category='1' and maincategory='${catid}' ORDER BY id DESC`;

    pool
      .query(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: "Got Category SuccessFull",
          data: run,
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
export const select_product_sub = async (req, res = response) => {
  try {
    const { maincatid, catid } = req.body;

    const select = `SELECT * FROM subcategory WHERE subcategory='${maincatid}' and maincategory='${catid}' and category='1' ORDER BY id DESC`;

    pool
      .query(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: "Got Category SuccessFull",
          data: run,
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
export const select_product_brand = async (req, res = response) => {
  try {
    const select = `SELECT * FROM brand WHERE status=1 ORDER BY id DESC`;

    pool
      .query(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: "Got Brand SuccessFull",
          data: run,
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

//get main all products by category id
export const get_main_all_products = async (req, res = response) => {
  try {
    const { catid, page_no } = req.body;
    const offset = (page_no - 1) * 20;

    const select = `SELECT * FROM products WHERE categoryid='${catid}' and vendortype=1 and status=1 ORDER BY id DESC LIMIT ${offset}, 20`;

    pool
      .query(select, (error, rr, fields) => {
        if (error) {
          console.error(error);
          return;
        }

        const responseData = [];

        // Iterate through the results and execute Query 2 for each element
        rr.forEach((row) => {
          console.log(row.options);
          pool.query(
            `SELECT * FROM productimage WHERE skucode='${row.skucode}' and vendorid='${row.vendorid}' LIMIT 1`,
            (error, results, fields) => {
              if (error) {
                console.error(error);
                return;
              }

              pool.query(
                `SELECT * FROM productsize WHERE skucode='${row.skucode}' and vendorid='${row.vendorid}'`,
                (error, lastr, fields) => {
                  if (error) {
                    console.error(error);
                    return;
                  }

                  responseData.push({
                    maindata: row,
                    img: results[0],
                    condition: { main: row.options, conditiondetails: lastr },
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

export const category_condition_productslist = async (req, res = response) => {
  try {
    const { catid, maincatid, subcatid, page_no } = req.body;
    const offset = (page_no - 1) * 20;
    var select;

    if (maincatid != null && subcatid == null) {
      select = `SELECT * FROM products WHERE maincategoryid='${maincatid}' and categoryid='${catid}' and status=1 ORDER BY id DESC LIMIT  ${offset}, 20`;
    } else if (maincatid != null && subcatid != null) {
      select = `SELECT * FROM products WHERE subcategoryid='${subcatid}' and maincategoryid='${maincatid}' and categoryid='${catid}' and status=1 ORDER BY id DESC LIMIT  ${offset}, 20`;
    }
    pool.query(select, (error, rr, fields) => {
      if (error) {
        console.error(error);
        return;
      }

      const responseData = [];

      // Iterate through the results and execute Query 2 for each element
      rr.forEach((row) => {
        pool.query(
          `SELECT * FROM productimage WHERE skucode='${row.skucode}' and vendorid='${row.vendorid}' LIMIT 1`,
          (error, results, fields) => {
            if (error) {
              console.error(error);
              return;
            }

            pool.query(
              `SELECT * FROM productsize WHERE skucode='${row.skucode}' and vendorid='${row.vendorid}'`,
              (error, lastr, fields) => {
                if (error) {
                  console.error(error);
                  return;
                }

                responseData.push({
                  maindata: row,
                  img: results[0],
                  condition: { main: row.options, conditiondetails: lastr },
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
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const all_products_bybrand = async (req, res = response) => {
  try {
    const { catid, page_no, brandname } = req.body;
    const offset = (page_no - 1) * 20;

    const select = `SELECT * FROM products WHERE brandname='${brandname}' and categoryid='${catid}' and status=1 ORDER BY id DESC LIMIT  ${offset}, 20`;

    pool.query(select, (error, rr, fields) => {
      if (error) {
        console.error(error);
        return;
      }

      const responseData = [];

      if (rr.length == 0) {
        res.json({
          resp: true,
          msg: "Got Details SuccessFull",
          services: [],
        });
      }
      // Iterate through the results and execute Query 2 for each element
      rr.forEach((row) => {
        pool.query(
          `SELECT * FROM productimage WHERE skucode='${row.skucode}' and vendorid='${row.vendorid}' LIMIT 1`,
          (error, results, fields) => {
            if (error) {
              console.error(error);
              return;
            }

            pool.query(
              `SELECT * FROM productsize WHERE skucode='${row.skucode}' and vendorid='${row.vendorid}'`,
              (error, lastr, fields) => {
                if (error) {
                  console.error(error);
                  return;
                }

                responseData.push({
                  maindata: row,
                  img: results[0],
                  condition: { main: row.options, conditiondetails: lastr },
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
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

//product details screen
export const product_details = async (req, res = response) => {
  try {
    const { skucode, vendorid } = req.body;

    const select = `SELECT * FROM products WHERE skucode='${skucode}' and vendorid='${vendorid}'`;

    pool.query(select, (error, rr, fields) => {
      if (error) {
        console.error(error);
        return;
      }

      const responseData = [];

      // Iterate through the results and execute Query 2 for each element
      rr.forEach((row) => {
        pool.query(
          `SELECT * FROM productimage WHERE skucode='${row.skucode}' and vendorid='${row.vendorid}' `,
          (error, results, fields) => {
            if (error) {
              console.error(error);
              return;
            }

            pool.query(
              `SELECT * FROM productsize WHERE skucode='${row.skucode}' and vendorid='${row.vendorid}'`,
              (error, lastr, fields) => {
                if (error) {
                  console.error(error);
                  return;
                }

                pool.query(
                  `SELECT * FROM reviews WHERE productid='${row.id}' and status=1 ORDER BY rating`,
                  (error, reviewresult, fields) => {
                    if (error) {
                      console.error(error);
                      return;
                    }

                    responseData.push({
                      maindata: row,
                      img: results,
                      condition: { main: row.options, conditiondetails: lastr },
                      reviews: reviewresult,
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
          }
        );
      });
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

//related product list
// export const productdetails_relatedproductlist = async (
//   req,
//   res = response
// ) => {
//   try {
//     const { catid, maincatid, subcatid, vendorid } = req.body;

//     const select = `SELECT * FROM products WHERE categoryid='${catid}' and maincategoryid='${maincatid}' and subcategoryid='${subcatid}' and vendorid='${vendorid}' and status=1 ORDER BY id DESC`;
//     pool.query(select, (error, rr, fields) => {
//       if (error) {
//         console.error(error);
//         return;
//       }

//       const responseData = [];

//       // Iterate through the results and execute Query 2 for each element
//       rr.forEach((row) => {
//         pool.query(
//           `SELECT * FROM productimage WHERE skucode='${row.skucode}' and vendorid='${row.vendorid}' LIMIT 1`,
//           (error, results, fields) => {
//             if (error) {
//               console.error(error);
//               return;
//             }

//             pool.query(
//               `SELECT * FROM productsize WHERE skucode='${row.skucode}' and vendorid='${row.vendorid}'`,
//               (error, lastr, fields) => {
//                 if (error) {
//                   console.error(error);
//                   return;
//                 }

//                 responseData.push({
//                   maindata: row,
//                   img: results[0],
//                   condition: { main: row.options, conditiondetails: lastr },
//                 });
//                 if (responseData.length === rr.length) {
//                   res.json({
//                     resp: true,
//                     msg: "Got Details SuccessFull",
//                     services: responseData,
//                   });
//                 }
//               }
//             );
//           }
//         );
//       });
//     });
//   } catch (e) {
//     return res.status(500).json({
//       resp: false,
//       msg: e,
//     });
//   }
// };

//get main all products by category id
export const get_main_productpage = async (req, res = response) => {
  try {
    const { catid, page_no } = req.body;
    const offset = (page_no - 1) * 20;

    const select = `SELECT * FROM offers WHERE maincategory='${catid}' ORDER BY id DESC`;

    const offerdata = [];
    const productdata = [];
    await pool
      .query(select, (error, offer, fields) => {
        if (error) {
          console.error(error);
          return;
        }

        // Iterate through the results and execute Query 2 for each element
        offer.forEach(async (eachoff) => {
          await pool.query(
            `SELECT * FROM products WHERE categoryid='${catid}' and exclusiveoffer='${eachoff.id}' and vendortype=1 and status=1 ORDER BY id DESC`,
            async (error, rr, fields) => {
              if (error) {
                console.error(error);
                return;
              }

              rr.forEach(async (eachrr) => {
                await pool.query(
                  `SELECT * FROM productimage WHERE skucode='${eachrr.skucode}' and vendorid='${eachrr.vendorid}' LIMIT 1`,
                  async (error, results, fields) => {
                    if (error) {
                      console.error(error);
                      return;
                    }

                    await pool.query(
                      `SELECT * FROM productsize WHERE skucode='${eachrr.skucode}' and options='${eachrr.options}'`,
                      (error, lastr, fields) => {
                        if (error) {
                          console.error(error);
                          return;
                        }

                        offerdata.push({
                          mainoffer: eachoff,
                          products: rr.map((row) => {
                            return {
                              maindata: row,
                              img: results[0],
                              weight: lastr,
                            };
                          }),
                        });

                        if (offerdata.length == offer.length) {
                          res.json({
                            resp: true,
                            msg: "Got Details SuccessFull",
                            services: offerdata,
                          });
                        }
                      }
                    );
                  }
                );
              });

              // if (productdata.length == rr.length) {
              //   console.log("this function working ");
              //   console.log(productdata.length);
              //   console.log(rr.length);
              //   console.log(offerdata.length);
              //   console.log(offer.length);
              //   offerdata.push({
              //     mainoffer: eachoff,
              //     products: productdata,
              //   });
              //   productdata.splice(0, productdata.length);
              //   // productdata.length = 0;
              // }
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

export const main_screen_shopbybrand = async (req, res = response) => {
  try {
    const select = `SELECT * FROM brand WHERE vendortype='Retailor' and status=1 ORDER BY id DESC`;

    pool
      .query(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: "Got Brands SuccessFull",
          data: run,
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

export const getproduct_cart = async (req, res = response) => {
  try {
    const { profileid } = req.body;

    const select = `SELECT * FROM shoppingcart WHERE profileid='${profileid}' and profiletype='user' and status=0`;

    pool
      .query(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: "Got Category SuccessFull",
          data: run,
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
