const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const OrderItem = require('./OrderItem'); // Import OrderItem model

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'Orders', // Explicitly set the table name
  timestamps: true
});

// Define association
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });


module.exports = Order;