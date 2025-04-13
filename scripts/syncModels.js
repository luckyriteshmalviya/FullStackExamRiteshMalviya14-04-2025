const { sequelize } = require('../config/database');

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Sequelize models synced with the database.');
    process.exit(0); // Exit the process after syncing
  } catch (err) {
    console.error('Error syncing Sequelize models:', err.message);
    process.exit(1); // Exit with an error code
  }
})();