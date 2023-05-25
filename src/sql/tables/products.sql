CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  category_id INT NOT NULL,
  brand_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  stock INT NOT NULL,
  minStock INT NOT NULL,
  maxStock INT NOT NULL,
  available BOOLEAN NOT NULL,
  unitCost DECIMAL(10, 2) NOT NULL,
  unitPrice DECIMAL(10, 2) NOT NULL,

  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (brand_id) REFERENCES brands(id)
);