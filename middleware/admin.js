module.exports = (req, res, next) => {
    // In a real app, you would check if user is admin

    console.log(req, "9900000")
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ msg: 'Admin access required' });
    }
  };