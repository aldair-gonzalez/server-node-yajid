import '../utils/env'

export default {
  host: process.env.MYSQL_HOST ?? 'localhost',
  user: process.env.MYSQL_USER ?? 'root',
  password: process.env.MYSQL_PASSWORD ?? 'root',
  port: process.env.MYSQL_PORT ?? 3306,
  database: process.env.MYSQL_DATABASE ?? 'test',
  tables: {
    categories: process.env.MYSQL_TABLE_CATEGORIES ?? 'categories',
    brands: process.env.MYSQL_TABLE_BRANDS ?? 'brands',
    products: process.env.MYSQL_TABLE_PRODUCTS ?? 'products',
    images: process.env.MYSQL_TABLE_IMAGES ?? 'images',
    users: process.env.MYSQL_TABLE_USERS ?? 'users',
    orders: process.env.MYSQL_TABLE_ORDERS ?? 'orders',
    order_items: process.env.MYSQL_TABLE_ORDER_ITEMS ?? 'order_items'
  }
}
