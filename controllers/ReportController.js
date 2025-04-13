// controllers/ReportController.js
const Order = require('../models/sql/Order');
// const OrderItem = require('../models/sql/orderItem');
const Product = require('../models/mongoDb/Product');
const { sequelize } = require('../config/database');

class ReportController {
  async getDailyRevenue(req, res) {
    try {
      // Advanced SQL query: Daily revenue for last 7 days
      const results = await sequelize.query(`
        SELECT 
          DATE(createdAt) as date,
          SUM(totalAmount) as revenue,
          COUNT(*) as orderCount
        FROM orders
        WHERE createdAt >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
      `, { type: sequelize.QueryTypes.SELECT });
      
      res.json(results);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }

  async getTopSpenders(req, res) {
    try {
      // Advanced SQL query: Top 3 spenders
      const results = await sequelize.query(`
        SELECT 
          u.id,
          u.username,
          u.email,
          SUM(o.totalAmount) as totalSpent,
          COUNT(o.id) as orderCount
        FROM orders o
        JOIN users u ON o.userId = u.id
        GROUP BY u.id, u.username, u.email
        ORDER BY totalSpent DESC
        LIMIT 3
      `, { type: sequelize.QueryTypes.SELECT });
      
      res.json(results);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }

  async getSalesByCategory(req, res) {
    try {
      // MongoDB aggregation: Sales by category
      const results = await Product.aggregate([
        {
          $lookup: {
            from: 'orderitems',
            localField: '_id',
            foreignField: 'productId',
            as: 'orderItems'
          }
        },
        {
          $unwind: {
            path: '$orderItems',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'orders',
            localField: 'orderItems.orderId',
            foreignField: 'id',
            as: 'order'
          }
        },
        {
          $unwind: {
            path: '$order',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$category',
            totalSales: { $sum: { $multiply: ['$orderItems.quantity', '$price'] } },
            totalItemsSold: { $sum: '$orderItems.quantity' },
            productCount: { $sum: 1 }
          }
        },
        {
          $sort: { totalSales: -1 }
        }
      ]);
      
      res.json(results);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
}

module.exports = new ReportController();