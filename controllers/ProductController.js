const Product = require('../models/mongoDb/Product');

class ProductController {
  async listProducts(req, res) {
    try {
      const { page = 1, limit = 10, category, search } = req.query;
      const skip = (page - 1) * limit;
      
      let query = {};
      
      if (category) {
        query.category = category;
      }
      
      if (search) {
        query.$text = { $search: search };
      }
      
      const products = await Product.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });
        
      const total = await Product.countDocuments(query);
      
      res.json({
        products,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }

  async getProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }
      res.json(product);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Product not found' });
      }
      res.status(500).send('Server error');
    }
  }

  async createProduct(req, res) {
    try {
      const { name, description, price, category, stock, imageUrl } = req.body;
      
      const product = new Product({
        name,
        description,
        price,
        category,
        stock,
        imageUrl
      });
      
      await product.save();
      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }

  async updateProduct(req, res) {
    try {
      const { name, description, price, category, stock, imageUrl } = req.body;
      
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { name, description, price, category, stock, imageUrl, updatedAt: Date.now() },
        { new: true }
      );
      
      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }
      
      res.json(product);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Product not found' });
      }
      res.status(500).send('Server error');
    }
  }

  async deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndRemove(req.params.id);
      
      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }
      
      res.json({ msg: 'Product removed' });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Product not found' });
      }
      res.status(500).send('Server error');
    }
  }
}

module.exports = new ProductController();