DROP DATABASE IF EXISTS bamazon_DB;
CREATE database bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price INT NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO prorducts (product_name, department_name, price, stock_quantity)
VALUES ("Sweater", "Clothing", 60, 10),
("Honeycrisp apple", "Produce", 2, 45),
("Men's slacks", "Clothing", 45, 8),
("Brussel sprouts", "Produce", 4, 6),
("Garden rake", "Hardware", 18, 6),
("Pictionary", "Game", 25, 8),
("Laptop computer", "Electronics", 419, 3),
("Socks", "Clothing", 12, 13),
("Spoons", "Houseware", 30, 5),
("Shovel", "Hardware", 18, 6);
SELECT * FROM products;
