var express = require("express");
const multer = require("multer");
var con = require("./connection");
var router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./server/images/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

router.get("/products", (req, res) => {
  con.query(`select * from products`, (err, rows) => {
    if (err) {
      res.send("Can get products");
    } else {
      res.send(rows);
    }
  });
});

router.get("/product/:id", (req, res) => {
  con.query(
    ` select * from products where category_id=?`,
    [req.params.id],
    (err, rows) => {
      if (err) {
        res.send("Can get products");
      } else {
        res.send(rows);
      }
    }
  );
});

router.post("/addProducts", (req, res) => {
  con.query(
    "INSERT INTO `products` (`product_name`, `category_id`, `price`, `img`) VALUES (?,?,?,?)",
    [req.body.name, req.body.categoryId, req.body.price, req.body.img],
    (err, rows) => {
      if (err) {
        res.send("Cant add product");
      } else {
        res.send({
          status: `Product added successfully: Name: ${req.body.name} | Category ID: ${req.body.categoryId} | Price: ${req.body.price}$`,
        });
      }
    }
  );
});

router.put("/addProductImg", upload.single("img"), (req, res) => {
  res.send({ path: req.file.path });
});

router.get("/dataForEdit/:sku", (req, res) => {
  con.query(
    ` select * from products where product_id=${req.params.sku}`,
    (err, rows) => {
      if (err) {
        res.send("Can get products");
      } else {
        res.send(rows);
      }
    }
  );
});

router.put("/editProduct", (req, res) => {
  con.query(
    "UPDATE `products` SET product_name=?, category_id=?, price=?, img=? WHERE product_id=?",
    [
      req.body.name,
      req.body.categoryId,
      req.body.price,
      req.body.img ? req.body.img : undefined,
      req.body.sku,
    ],
    (err, rows) => {
      if (err) {
        res.send("Cant edit product");
      } else {
        res.send({
          status: `Product updated successfully: Name: ${req.body.name} | Category ID: ${req.body.categoryId} | Price: ${req.body.price}$`,
        });
      }
    }
  );
});

router.get("/cartProducts", (req, res) => {
  con.query(
    "SELECT * FROM `cart_products` where cart_id=?",
    [req.session.userData.cartId],
    (err, rows) => {
      if (err) {
        res.send("Error in Server");
      } else {
        res.send(rows);
      }
    }
  );
});

router.post("/addCartProducts", (req, res) => {
  con.query(
    "INSERT INTO `cart_products` (`product_id`, `amount`, `total_price`, `cart_id`, `product_name`) VALUES (?,?,?,?,?)",
    [
      req.body.product_id,
      req.body.amount,
      req.body.totalPrice,
      req.session.userData.cartId,
      req.body.product_name,
    ],
    (err, rows) => {
      if (err) {
        res.send("Cant add product");
      } else {
        res.send({ productAdded: true });
      }
    }
  );
});

router.delete("/deleteCartProducts/:productId", (req, res) => {
  con.query(
    "DELETE FROM `cart_products` WHERE product_id=? and cart_id=?",
    [req.params.productId, req.session.userData.cartId],
    (err, rows) => {
      if (err) {
        res.send("Cant add product");
      } else {
        res.send({ productDeleted: true });
      }
    }
  );
});

router.delete("/deleteAllCartProducts", (req, res) => {
  con.query(
    "DELETE FROM `cart_products` WHERE cart_id=?",
    [req.session.userData.cartId],
    (err, rows) => {
      if (err) {
        res.send("Cant add product");
      } else {
        res.send({ productsDeleted: true });
      }
    }
  );
});

router.delete("/deleteCart", (req, res) => {
  con.query(
    "DELETE FROM `carts` WHERE cart_id=?",
    [req.session.userData.cartId],
    (err, rows) => {
      if (err) {
        res.send("Cant add product");
      } else {
        console.log("Cart Deleted");
      }
    }
  );
});

router.post("/cart", (req, res) => {
  const date = new Date();
  con.query(
    "INSERT INTO `carts` (`customer_id`, `date`) VALUES (?,?)",
    [req.session.userData.id, date],
    (err, rows) => {
      if (err) {
        console.log("cant create cart");
      } else {
        res.send(rows);
      }
    }
  );
});

router.get("/isManager", (req, res) => {
  if (typeof req.session.userData != "undefined") {
    con.query(
      "SELECT `manager` FROM `customers` where customer_id=?",
      [req.session.userData.id],
      (err, rows) => {
        if (err) {
          res.send("Error in Server");
        } else {
          rows.map((isManager) => {
            res.send(isManager);
          });
        }
      }
    );
  } else {
    res.send("Not Login");
  }
});

module.exports = router;
