var express = require("express");
var con = require("./connection");
var path = require("path");
var pdfFocument = require("pdfkit");
var fs = require("fs");
var router = express.Router();

router.get("/createReceipt", (req, res) => {
  var doc = new pdfFocument();
  doc.pipe(
    fs.createWriteStream(
      `./server/receipt/receipt.${req.session.userData.id}.pdf`
    )
  );
  var products;
  var totalPrice;
  var orderDate;
  var shippingDate;
  var shippingDetails;
  var card;

  con.query(
    "SELECT * FROM `cart_products` where cart_id=?",
    [req.session.userData.cartId],
    (err, rows) => {
      if (err) {
        res.send("Error in Server");
      } else {
        products = rows;

        con.query(
          "SELECT * FROM `orders` where customer_id=?",
          [req.session.userData.id],
          (err, rows) => {
            if (err) {
              res.send("Error in Server");
            } else {
              rows.map((field) => {
                totalPrice = field.total_price;
                orderDate = field.order_date;
                shippingDate = field.shipping_date;
                shippingDetails = field.street;
                card = field.last_digits;
              });
              doc.text(`Receipt: ${req.session.userData.id}`);
              doc.text(`----------------------------------`);
              doc.text(` `);

              products.map((i) => {
                doc.text(
                  `Product: ${i.product_name} | Amount: ${i.amount} | Price: ${i.total_price}`
                );
              });
              doc.text(` `);
              doc.text(`Total Price: ${totalPrice}$`);
              doc.text(`----------------------------------`);
              doc.text(` `);

              doc.text(`Order Date: ${orderDate}`);
              doc.text(`Shipping Date: ${shippingDate}`);
              doc.text(`Shipping Details: ${shippingDetails}`);
              doc.text(`Credit Card: ${card}`);

              doc.end();
            }
          }
        );
      }
    }
  );
});

router.get("/downloadReceipt", (req, res) => {
  filePath = path.join(
    __dirname,
    `./receipt/receipt.${req.session.userData.id}.pdf`
  );
  res.sendFile(filePath);
});

module.exports = router;
