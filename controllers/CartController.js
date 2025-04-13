const Cart = require('../models/mongoDb/Cart');
const Product = require('../models/mongoDb/Product');

class CartController {
  async getCart(req, res) {
    try {
      const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
      if (!cart) {
        return res.json({ items: [] });
      }
      res.json(cart);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }

  async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;
      
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }
      
      if (product.stock < quantity) {
        return res.status(400).json({ msg: 'Insufficient stock' });
      }
      
      let cart = await Cart.findOne({ userId: req.user.id });
      
      if (!cart) {
        cart = new Cart({
          userId: req.user.id,
          items: [{ productId, quantity }]
        });
      } else {
        const itemIndex = cart.items.findIndex(
          item => item.productId.toString() === productId
        );
        
        if (itemIndex >= 0) {
          cart.items[itemIndex].quantity += quantity;
        } else {
          cart.items.push({ productId, quantity });
        }
      }
      
      await cart.save();
      res.json(cart);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Product not found' });
      }
      res.status(500).send('Server error');
    }
  }

  async removeFromCart(req, res) {
    try {
      const { productId } = req.params;
      
      let cart = await Cart.findOne({ userId: req.user.id });
      
      if (!cart) {
        return res.status(404).json({ msg: 'Cart not found' });
      }
      
      // Filter out the item to remove
      cart.items = cart.items.filter(
        item => item.productId.toString() !== productId
      );
      
      await cart.save();
      res.json(cart);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Product not found' });
      }
      res.status(500).send('Server error');
    }
  }

  async updateCartItem(req, res) {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      
      // Validate quantity
      if (quantity <= 0) {
        return res.status(400).json({ msg: 'Quantity must be greater than 0' });
      }
      
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }
      
      if (product.stock < quantity) {
        return res.status(400).json({ msg: 'Insufficient stock' });
      }
      
      let cart = await Cart.findOne({ userId: req.user.id });
      
      if (!cart) {
        return res.status(404).json({ msg: 'Cart not found' });
      }
      
      const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );
      
      if (itemIndex < 0) {
        return res.status(404).json({ msg: 'Item not found in cart' });
      }
      
      cart.items[itemIndex].quantity = quantity;
      
      await cart.save();
      res.json(cart);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Product not found' });
      }
      res.status(500).send('Server error');
    }
  }

  async clearCart(req, res) {
    try {
      const cart = await Cart.findOneAndUpdate(
        { userId: req.user.id },
        { items: [] },
        { new: true }
      );
      
      if (!cart) {
        return res.status(404).json({ msg: 'Cart not found' });
      }
      
      res.json(cart);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
}

module.exports = new CartController();