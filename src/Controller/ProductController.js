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

    const rr = await pool.query(
      `SELECT * FROM products WHERE categoryid='${catid}' and status=1 ORDER BY id DESC LIMIT ?, 20`,
      [offset]
    );

    const responseData = await Promise.all(
      rr.map(async (row) => {
        try {
          const [results, lastr] = await Promise.all([
            pool.query(
              `SELECT * FROM productimage WHERE skucode='${row.skucode}' and vendorid='${row.vendorid}' LIMIT 1`
            ),
            pool.query(
              `SELECT * FROM productsize WHERE options='${row.options}' and skucode='${row.skucode}' and vendorid='${row.vendorid}'`
            ),
          ]);

          return {
            maindata: row,
            img: results[0],
            condition: { main: row.options, conditiondetails: lastr },
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      })
    );

    res.json({
      resp: true,
      msg: "Got Details SuccessFull",
      services: responseData.filter((data) => data !== null),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      resp: false,
      msg: e.message || "Something went wrong!",
    });
  }
};

// export const get_main_all_products = async (req, res = response) => {
//   try {
//     const { catid, page_no } = req.body;
//     const offset = (page_no - 1) * 20;

//     const select = `SELECT * FROM products WHERE categoryid='${catid}' and vendortype=1 and status=1 ORDER BY id DESC LIMIT ${offset}, 20`;

//     pool.query(select, async (error, rr, fields) => {
//       if (error) {
//         console.error(error);
//         return;
//       }

//       const responseData = [];

//       for (const row of rr) {
//         try {
//           const [results, lastr] = await Promise.all([
//             pool.query(
//               `SELECT * FROM productimage WHERE skucode='${row.skucode}' and vendorid='${row.vendorid}' LIMIT 1`
//             ),
//             pool.query(
//               `SELECT * FROM productsize WHERE options='${row.options}' and skucode='${row.skucode}' and vendorid='${row.vendorid}'`
//             ),
//           ]);

//           responseData.push({
//             maindata: row,
//             img: results[0],
//             condition: { main: row.options, conditiondetails: lastr },
//           });
//         } catch (error) {
//           console.error(error);
//         }
//       }

//       res.json({
//         resp: true,
//         msg: "Got Details SuccessFull",
//         services: responseData,
//       });
//     });
//   } catch (e) {
//     return res.status(500).json({
//       resp: false,
//       msg: e,
//     });
//   }
// };

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
    const { skucode, vendorid, profileid } = req.body;

    const select = `SELECT * FROM products WHERE skucode='${skucode}' and vendorid='${vendorid}'`;

    pool.query(select, async (error, rr, fields) => {
      if (error) {
        console.error(error);
        return;
      }

      const promises = rr.map(async (row) => {
        const [
          imgResults,
          sizeResults,
          colorResults,
          reviewResults,
          reviewCheck,
        ] = await Promise.all([
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
          pool.query(
            `SELECT * FROM shoppingcart WHERE productid='${row.id}' and profileid='${profileid}' and profiletype='user' and vendorid='${vendorid}' and status=1`
          ),
        ]);

        const firstReviewId = row.id;
        const firstCartId = reviewCheck[0]?.productid;
        const reviewMatch = Number(firstReviewId) === Number(firstCartId);

        return {
          maindata: row,
          img: imgResults,
          colorresult: colorResults,
          condition: {
            main: row.options,
            conditiondetails: sizeResults,
          },
          reviews: reviewResults,
          canReview: reviewMatch,
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

    const select = `SELECT * FROM offers WHERE maincategory='${catid}' and status=1 ORDER BY id DESC`;

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
    const select = `SELECT * FROM brand WHERE vendortype='Retailor' and status=1 and showonhome=1 ORDER BY id DESC`;

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
    const { profileid, selectedcategory } = req.body;

    const select = `SELECT * FROM shoppingcart WHERE profileid='${profileid}' and profiletype='user' and vendortype='Retailor' and gsttype='${selectedcategory}' and status=0`;
    const subtotal = await pool.query(
      `SELECT sum(subtotal) as subtotal FROM shoppingcart WHERE profileid='${profileid}' and profiletype='user' and vendortype='Retailor' and gsttype='${selectedcategory}' and status=0`
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
      if (run.length > 0) {
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
        await pool.query(`INSERT INTO shoppingcart (cartid, productid, product, productname, productseo, productsku, productbrand, mainprice, price, gst, charge, color, options, sizeweight, stock, quantity, subtotal, profileid, profiletype, vendorid, status) 
    VALUES ('${cartid}', '${productid}', '${product}', '${productname}', '${productseo}', '${productsku}', '${productbrand}', '${prices}', '${price}', '${gst}', '${charge}', '${color}', '${options}', '${sizeweight}', '${stock}', '${quantity}', '${subtotal}', '${profilesid}', '${profiletype}', '${vendorid}', '${status}')`);
        res.json({
          resp: true,
          msg: "Product Added SuccessFully",
        });
        return;
        // Handle case where no matching records are found
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

export const get_product_booked_history = async (req, res = response) => {
  try {
    const { profileid } = req.body;

    const select = `SELECT * FROM shoppingcart WHERE profileid='${profileid}' and profiletype='user' and vendortype='Retailor' and gsttype='GST' and status=1`;

    pool
      .query(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: "Got Products SuccessFull",
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

export const get_nearbyproduct_booked_history = async (req, res = response) => {
  try {
    const { profileid } = req.body;

    const select = `SELECT * FROM shoppingcart WHERE profileid='${profileid}' and profiletype='user' and vendortype='Retailor' and gsttype='NOT-GST' and status=1`;

    pool
      .query(select)
      .then((run) => {
        res.json({
          resp: true,
          msg: "Got Products SuccessFull",
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

export const get_product_booked_details = async (req, res = response) => {
  try {
    const { orderid, profileid } = req.body;

    const select = `SELECT * FROM shoppingcart WHERE orderid='${orderid}'`;

    pool
      .query(select)
      .then(async (run) => {
        res.json({
          resp: true,
          msg: "Got Products SuccessFull",
          data: run[0],
          address: await pool.query(
            `SELECT * FROM user_address WHERE addressid='${run[0].addressid}' and profileid='${profileid}'`
          ),
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

export const get_specific_vendor_productpage = async (req, res = response) => {
  try {
    const { vendorid, profileid } = req.body;
    const vendorquery = `SELECT * FROM vendor WHERE vendorid='${vendorid}'`;
    const categoryquery = `SELECT * FROM main_category WHERE cat='Retailor' and pid='1' and status=1 ORDER BY id DESC`;
    // const seatesquery = `SELECT * FROM availableseat WHERE vendorid='${vendorid}' and status=1 ORDER BY id ASC`;
    // const bannerquery = `SELECT * FROM vendorbanners WHERE vendorid='${vendorid}' and status=1 ORDER BY id DESC`;
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

    const myvendor = await getData(vendorquery).then((row) => {
      return row;
    });
    // const banners = await getData(bannerquery).then((row) => {
    //   return row;
    // });
    // const cancelled_price = [...cancelled];

    res.json({
      resp: true,
      msg: "Got Services SuccessFull",
      vendordeatil: myvendor[0],
      category: reqcat.filter((i) => catarray.includes(i.id.toString())),
      liked: liked.length != 0 ? true : false,
      // seats: seats.map((e) => {
      //   return e;
      // }),
      // banner: banners.map((e) => {
      //   return e;
      // }),
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

export const get_products_according_vendor = async (req, res = response) => {
  try {
    const { vendorid, catid, page_no } = req.body;
    const offset = (page_no - 1) * 20;

    const result = [];

    const run = await pool.query(
      `SELECT * FROM exclusiveoffers WHERE category='${catid}' and vendorid='${vendorid}' ORDER BY id DESC`
    );

    for (const row of run) {
      const run2 = await pool.query(
        `SELECT * FROM offers WHERE id='${row.offercategory}' and status=1`
      );
      for (const row2 of run2) {
        const offer_id = row2.id;
        const offer_seo = row2.seo;
        if (row.offercategory == offer_id) {
          result.push({ myoffer: row });
        } else {
          null;
        }
      }
    }

    const rr = await pool.query(
      `SELECT * FROM products WHERE categoryid='${catid}' and vendorid='${vendorid}' and status=1 ORDER BY id DESC LIMIT ?, 20`,
      [offset]
    );

    const responseData = await Promise.all(
      rr.map(async (row) => {
        try {
          const [results, lastr] = await Promise.all([
            pool.query(
              `SELECT * FROM productimage WHERE skucode='${row.skucode}' and vendorid='${row.vendorid}' LIMIT 1`
            ),
            pool.query(
              `SELECT * FROM productsize WHERE options='${row.options}' and skucode='${row.skucode}' and vendorid='${row.vendorid}'`
            ),
          ]);

          return {
            maindata: row,
            img: results[0],
            condition: { main: row.options, conditiondetails: lastr },
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      })
    );

    res.json({
      resp: true,
      msg: "Got Details SuccessFull",
      offerimages: result,
      services: responseData.filter((data) => data !== null),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      resp: false,
      msg: e.message || "Something went wrong!",
    });
  }
};

export const get_nearby_product_shops = async (req, res = response) => {
  try {
    const { mainid, profileid } = req.body;
    const query =
      "SELECT * FROM vendor WHERE status = 1 " +
      "AND category = 'buy-a-product' " +
      "AND activated = 1 " +
      `AND maincategory LIKE CONCAT('%', '${mainid}', '%') ` +
      "ORDER BY id ASC";
    getData(query, { $mainid: mainid })
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

export const search_among_all_products = async (req, res = response) => {
  try {
    const { productname } = req.body;

    const rr = await pool.query(
      `SELECT * FROM products  WHERE name LIKE '%${productname}%' and status=1 ORDER BY id DESC LIMIT ?, 20`,
      [0]
    );

    const responseData = await Promise.all(
      rr.map(async (row) => {
        try {
          const [results, lastr] = await Promise.all([
            pool.query(
              `SELECT * FROM productimage WHERE skucode='${row.skucode}' and vendorid='${row.vendorid}' LIMIT 1`
            ),
            pool.query(
              `SELECT * FROM productsize WHERE options='${row.options}' and skucode='${row.skucode}' and vendorid='${row.vendorid}'`
            ),
          ]);

          return {
            maindata: row,
            img: results[0],
            condition: { main: row.options, conditiondetails: lastr },
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      })
    );

    res.json({
      resp: true,
      msg: "Got Details SuccessFull",
      products: responseData.filter((data) => data !== null),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      resp: false,
      msg: e.message || "Something went wrong!",
    });
  }
};

export const submitnewproductreview = async (req, res = response) => {
  try {
    const { productid, productname, rating, name, message, profileid } =
      req.body;
    const reviewid = Math.floor(Math.random() * 9000) + 1000;
    const options = { timeZone: "Asia/Kolkata" };
    const profiletype = "user";

    // Get the current date and time
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", options);
    const formattedTime = date.toLocaleTimeString("en-US", options);

    const validatedUserEmail = await pool.query(
      `SELECT * FROM users WHERE profileid='${profileid}' and status=1`
    );

    await pool
      .query(
        `INSERT INTO reviews (reviewid,productid,productname,rating,name,email,message,date,time,profileid,profiletype,status) VALUES ('${reviewid}','${productid}','${productname}','${rating}','${name}','${validatedUserEmail[0].email}','${message}','${formattedDate}','${formattedTime}','${profileid}','${profiletype}','1')`
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
