const Order = require('../models/sql/Order');
// const OrderItem = require('../models/sql/orderItem');
const Cart = require('../models/mongoDb/Cart');
const Product = require('../models/mongoDb/Product');
const { sequelize } = require('../config/database');

class OrderController {
  async createOrder(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      // Get user's cart
      const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
      
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ msg: 'Cart is empty' });
      }
      
      let totalAmount = 0;
      const orderItems = [];
      
      for (const item of cart.items) {
        const product = item.productId;
        
        if (product.stock < item.quantity) {
          await transaction.rollback();
          return res.status(400).json({ 
            msg: `Insufficient stock for product: ${product.name}` 
          });
        }
        
        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;
        
        orderItems.push({
          productId: product._id.toString(),
          quantity: item.quantity,
          price: product.price
        });
      }
      
      const order = await Order.create({
        userId: req.user.id,
        totalAmount,
        status: 'pending'
      }, { transaction });
      
      // Create order items
      for (const item of orderItems) {
        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }, { transaction });
      }
      
      // Update product stocks in MongoDB
      for (const item of cart.items) {
        await Product.findByIdAndUpdate(
          item.productId._id,
          { $inc: { stock: -item.quantity } }
        );
      }
      
      // Clear cart
      await Cart.findOneAndUpdate(
        { userId: req.user.id },
        { items: [] }
      );
      
      await transaction.commit();
      res.json(order);
    } catch (err) {
      await transaction.rollback();
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }

  async getOrders(req, res) {
    try {
      const orders = await Order.findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: OrderItem,
            as: 'items'
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      
      res.json(orders);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }

  async getOrder(req, res) {
    try {
      const order = await Order.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        },
        include: [
          {
            model: OrderItem,
            as: 'items'
          }
        ]
      });
      
      if (!order) {
        return res.status(404).json({ msg: 'Order not found' });
      }
      
      res.json(order);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
}

module.exports = new OrderController();