var express = require("express");
var con = require("./connection");
var router = express.Router();

router.get("/auth", (req, res) => {
  if (typeof req.session.userData != "undefined") {
    res.send({ isLoggedIn: true, userDatails: req.session.userData });
  } else {
    res.send({ isLoggedIn: false });
  }
});

router.post("/login", (req, res) => {
  con.query(
    ` select * from customers where mail=? and password=? `,
    [req.body.email, req.body.password],
    (err, rows) => {
      if (err) {
        res.send("Wrong password or email");
      } else {
        if (rows.length === 1) {
          rows.map((d) => {
            req.session.userData = {
              isLoggedIn: true,
              email: d.mail,
              name: d.first_name,
              id: d.customer_id,
            };
            res.send({ loginOk: true, name: req.session.userData.name });
          });
        } else {
          res.send({ loginOk: false });
        }
      }
    }
  );
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.send({ logoutOk: true });
});

router.post("/idCheck", (req, res) => {
  con.query(
    ` select * from customers where customer_id=?`,
    [req.body.id],
    (err, rows) => {
      if (err) {
        res.send("Server Fail");
      } else {
        if (rows.length == 1) {
          res.send({ idExist: true });
        } else {
          res.send({ idExist: false });
        }
      }
    }
  );
});

router.post("/signInB", (req, res) => {
  con.query(
    "INSERT INTO `customers` (`first_name`, `last_name`, `mail`, `customer_id`, `password`, `city`, `street`) VALUES (?,?,?,?,?,?,?)",
    [
      req.body.name,
      req.body.lastName,
      req.body.email,
      req.body.id,
      req.body.password,
      req.body.city,
      req.body.street,
    ],
    (err, rows) => {
      if (err) {
        res.send("Error in Server");
      } else {
        res.send({ signInOk: true });
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

router.get("/cartCheck", (req, res) => {
  con.query(
    ` select * from carts where customer_id=${req.session.userData.id}`,
    (err, rows) => {
      if (err) {
        console.log("server problem");
      } else {
        if (rows.length >= 1) {
          rows.map((cartId) => {
            req.session.userData.cartId = cartId.cart_id;
          });
          res.send({ haveCart: true });
        } else {
          res.send({ haveCart: false });
        }
      }
    }
  );
});

router.get("/ordersAmount", (req, res) => {
  con.query("SELECT * FROM `orders`", (err, rows) => {
    if (err) {
      res.send("Error in Server");
    } else {
      res.send({ ordersAmount: rows.length });
    }
  });
});

router.get("/userOrdersAmount", (req, res) => {
  con.query(
    "SELECT * FROM `orders` where customer_id=?",
    [req.session.userData.id],
    (err, rows) => {
      if (err) {
        res.send("Error in Server");
      } else {
        res.send({ userOrdersAmount: rows.length });
      }
    }
  );
});

router.get("/availableProducts", (req, res) => {
  con.query("SELECT * FROM `products`", (err, rows) => {
    if (err) {
      res.send("Error in Server");
    } else {
      res.send({ availableProducts: rows.length });
    }
  });
});

module.exports = router;
