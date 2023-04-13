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

    pool.query(select, async (error, rr, fields) => {
      if (error) {
        console.error(error);
        return;
      }

      const responseData = [];

      for (const row of rr) {
        try {
          const [results, lastr] = await Promise.all([
            pool.query(
              `SELECT * FROM productimage WHERE skucode='${row.skucode}' and vendorid='${row.vendorid}' LIMIT 1`
            ),
            pool.query(
              `SELECT * FROM productsize WHERE options='${row.options}' and skucode='${row.skucode}' and vendorid='${row.vendorid}'`
            ),
          ]);

          responseData.push({
            maindata: row,
            img: results[0],
            condition: { main: row.options, conditiondetails: lastr },
          });
        } catch (error) {
          console.error(error);
        }
      }

      res.json({
        resp: true,
        msg: "Got Details SuccessFull",
        services: responseData,
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

    pool.query(select, async (error, rr, fields) => {
      if (error) {
        console.error(error);
        return;
      }

      const promises = rr.map(async (row) => {
        const [imgResults, sizeResults, colorResults, reviewResults] =
          await Promise.all([
            pool.query(
              `SELECT * FROM productimage WHERE skucode='${row.skucode}' and vendorid='${row.vendorid}'`
            ),
            pool.query(
              `SELECT * FROM productsize WHERE skucode='${row.skucode}' and vendorid='${row.vendorid}'`
            ),
            pool.query(
              `SELECT * FROM productcolor WHERE skucode='${row.skucode}' and vendorid='${row.vendorid}'`
            ),
            pool.query(
              `SELECT * FROM reviews WHERE productid='${row.id}' and status=1 ORDER BY rating`
            ),
          ]);

        return {
          maindata: row,
          img: imgResults,
          colorresult: colorResults,
          condition: {
            main: row.options,
            conditiondetails: sizeResults,
          },
          reviews: reviewResults,
        };
      });

      try {
        const responseData = await Promise.all(promises);

        res.json({
          resp: true,
          msg: "Got Details Successfully",
          services: responseData,
        });
      } catch (e) {
        console.error(e);
        res.status(500).json({
          resp: false,
          msg: e,
        });
      }
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

    const offers = await pool.query(select);

    for (const offer of offers) {
      const products = await pool.query(`
      SELECT * FROM products 
      WHERE categoryid='${catid}' AND exclusiveoffer='${offer.id}' AND vendortype=1 AND status=1 
      ORDER BY id DESC
    `);

      const productDetails = await Promise.all(
        products.map(async (product) => {
          const [image] = await pool.query(`
          SELECT * FROM productimage 
          WHERE skucode='${product.skucode}' AND vendorid='${product.vendorid}' 
          LIMIT 1
        `);

          const size = await pool.query(`
          SELECT * FROM productsize WHERE options='${product.options}' and skucode='${product.skucode}' and vendorid='${product.vendorid}'
        `);

          return {
            maindata: product,
            img: image,
            condition: { main: product.options, conditiondetails: size },
          };
        })
      );

      offerdata.push({
        mainoffer: offer,
        products: productDetails,
      });
    }

    res.json({
      resp: true,
      msg: "Got Details Successfully",
      services: offerdata,
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
    const subtotal = await pool.query(
      `SELECT sum(subtotal) as subtotal FROM shoppingcart WHERE profileid='${profileid}' and profiletype='user' and status=0`
    );
    const shipcharges = await pool.query(
      `SELECT * FROM shipping_charge WHERE id=1`
    );

    let subprice, totalprice, deliverycharge;

    if (subtotal[0].subtotal < shipcharges[0].maximum) {
      deliverycharge = shipcharges[0].title;
      totalprice = Number(subtotal[0].subtotal) + Number(shipcharges[0].title);
    } else {
      deliverycharge = 0;
      totalprice = Number(subtotal[0].subtotal) + 0;
    }

    pool
      .query(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: "Got Category SuccessFull",
          subtotal: subtotal[0].subtotal,
          shipcharges: deliverycharge,
          totalcharges: totalprice,
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

export const add_product_tocart = async (req, res = response) => {
  try {
    const cartid = "JDOU" + Math.floor(Math.random() * 9000 + 1000);
    const productid = req.body.productid;
    const product = req.body.product;
    const productname = req.body.productname;
    const productseo = req.body.productseo;
    const productsku = req.body.productsku;
    const productbrand = req.body.productbrand;
    const prices = req.body.price;
    const maingst = req.body.gst;
    const maincolor = req.body.color;
    const options = req.body.options;
    const sizeweight = req.body.sizeweight;
    const stock = req.body.stock;
    const quantity = req.body.quantity;
    const profilesid = req.body.profilesid;
    const vendorid = req.body.vendorid;
    const profiletype = req.body.profiletype;

    console.log(prices, maingst);

    let gst, color;

    if (maingst) {
      gst = maingst;
    } else {
      gst = 0;
    }

    if (maincolor) {
      color = maincolor;
    } else {
      color = null;
    }

    const servicecharges = (prices * gst) / 100;
    const servicecharge = Number(servicecharges.toFixed(0));
    const charge = servicecharge * quantity;
    const price = prices - charge;
    const subtotal = prices * quantity;
    const status = 0;

    if (options === "None") {
      const run = await pool.query(
        `SELECT * FROM shoppingcart WHERE productid = '${productid}' AND status = 0 AND profileid = '${profilesid}' AND profiletype = '${profiletype}' AND vendorid = '${vendorid}'`
      );
      for (const data of run.rows) {
        const allcartid = data.id;
        const allproductid = data.productid;
        const qty = data.quantity;
        const allqty = qty + quantity;

        const servicecharges1 = (prices * gst) / 100;
        const servicecharge1 = Number(servicecharges1.toFixed(0));
        const charge1 = servicecharge1 * allqty;
        const price1 = prices - charge1;
        const subtotal1 = prices * allqty;

        if (Number(productid) === Number(allproductid)) {
          await pool.query(
            `UPDATE shoppingcart SET price='${price1}', charge='${charge1}', quantity='${allqty}', subtotal='${subtotal1}' WHERE id='${allcartid}'`
          );
          res.json({
            resp: true,
            msg: "Product Updated SuccessFully",
          });
          return;
        } else {
          await pool.query(
            `INSERT INTO shoppingcart (cartid, productid, product, productname, productseo, productsku, productbrand, mainprice, price, gst, charge, color, options, sizeweight, stock, quantity, subtotal, profileid, profiletype, vendorid, status) VALUES ('${cartid}', '${productid}', '${product}', '${productname}', '${productseo}', '${productsku}', '${productbrand}', '${prices}', '${price}', '${gst}', '${charge}', '${color}', '${options}', '${sizeweight}', '${stock}', '${quantity}', '${subtotal}', '${profilesid}', '${profiletype}', '${vendorid}', '${status}')`
          );
          res.json({
            resp: true,
            msg: "Product Added SuccessFully",
          });
          return;
        }
      }
    } else {
      console.log("there");
      const run = await pool.query(
        `SELECT * FROM shoppingcart WHERE productid='${productid}' AND status=0 AND options='${options}' AND sizeweight='${sizeweight}' AND profileid='${profilesid}' AND profiletype='${profiletype}' AND vendorid='${vendorid}'`
      );

      if (run.length > 0) {
        for (const data of run) {
          console.log("till that");
          const allcartid = data.id;
          const allproductid = data.productid;
          const qty = data.quantity;
          const allqty = Number(qty) + Number(quantity);

          const servicecharges1 = (prices * gst) / 100;
          const servicecharge1 = Number(servicecharges1.toFixed(0));
          const charge1 = servicecharge1 * allqty;
          const subtotal1 = prices * allqty;
          const price1 = subtotal1 - charge1;

          if (Number(productid) === Number(allproductid)) {
            await pool.query(
              `UPDATE shoppingcart SET price='${price1}', charge='${charge1}', quantity='${allqty}', subtotal='${subtotal1}' WHERE id='${allcartid}'`
            );
            res.json({
              resp: true,
              msg: "Product Updated SuccessFully",
            });
            return;
          } else {
            await pool.query(`INSERT INTO shoppingcart (cartid, productid, product, productname, productseo, productsku, productbrand, mainprice, price, gst, charge, color, options, sizeweight, stock, quantity, subtotal, profileid, profiletype, vendorid, status) 
        VALUES ('${cartid}', '${productid}', '${product}', '${productname}', '${productseo}', '${productsku}', '${productbrand}', '${prices}', '${price}', '${gst}', '${charge}', '${color}', '${options}', '${sizeweight}', '${stock}', '${quantity}', '${subtotal}', '${profilesid}', '${profiletype}', '${vendorid}', '${status}')`);
            res.json({
              resp: true,
              msg: "Product Added SuccessFully",
            });
            return;
          }
        }
      } else {
        await pool.query(`INSERT INTO shoppingcart (cartid, productid, product, productname, productseo, productsku, productbrand, mainprice, price, gst, charge, color, options, sizeweight, stock, quantity, subtotal, profileid, profiletype, vendorid, status) 
        VALUES ('${cartid}', '${productid}', '${product}', '${productname}', '${productseo}', '${productsku}', '${productbrand}', '${prices}', '${price}', '${gst}', '${charge}', '${color}', '${options}', '${sizeweight}', '${stock}', '${quantity}', '${subtotal}', '${profilesid}', '${profiletype}', '${vendorid}', '${status}')`);
        res.json({
          resp: true,
          msg: "Product Added SuccessFully",
        });
        return;
        // Handle case where no matching records are found
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

export const removeuserproduct = async (req, res = response) => {
  try {
    await pool.query("DELETE FROM shoppingcart WHERE id = ?", [
      req.body.cartid,
    ]);

    res.json({
      resp: true,
      msg: "Product Removed",
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};
