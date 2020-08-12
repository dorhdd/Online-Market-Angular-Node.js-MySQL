var express = require("express");
var con = require("./connection");
var router = express.Router();

router.get("/cartProducts", (req, res) => {
  con.query(
    "SELECT * FROM `cart_products` where cart_id=?",
    [req.session.userData.cartId],
    (err, rows) => {
      if (err) {
        res.send("Error in Server");
      } else {
        console.log(rows);
        res.send(rows);
      }
    }
  );
});

router.get("/cities", (req, res) => {
  con.query("SELECT * FROM `cities`", (err, rows) => {
    if (err) {
      res.send("Error in Server");
    } else {
      res.send(rows);
    }
  });
});

router.post("/orderDetails", (req, res) => {
  con.query(
    "INSERT INTO `orders` (`customer_id`, `cart_id`, `total_price`, `city`, `street`, `shipping_date`, `order_date`, `last_digits`) VALUES (?,?,?,?,?,?,?,?)",
    [
      req.session.userData.id,
      req.session.userData.cartId,
      req.body.totalPrice,
      req.body.city,
      req.body.street,
      req.body.shippingDate,
      req.body.orderDate,
      +req.body.cardNumber,
    ],
    (err, rows) => {
      if (err) {
        res.send("Error in Server");
      } else {
        res.send({ orderSaved: true });
      }
    }
  );
});

router.get("/customerDetails", (req, res) => {
  con.query(
    "SELECT city, street FROM `customers` where customer_id=?",
    [req.session.userData.id],
    (err, rows) => {
      if (err) {
        res.send("Error in Server");
      } else {
        res.send(rows);
      }
    }
  );
});

router.get("/dateCheck", (req, res) => {
  con.query(
    "SELECT shipping_date FROM `orders`",
    (err, rows) => {
      if (err) {
        res.send("Error in Server");
      } else {
        res.send(rows)
      }
    }
  );
});

module.exports = router;

