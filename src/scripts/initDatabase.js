import sequelize from '../config/database.js';
import MonthlySeasonality from '../models/MonthlySeasonality.js';

async function initDatabase() {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync the model with the database (create table if it doesn't exist)
    await MonthlySeasonality.sync({ alter: true });
    console.log('MonthlySeasonality table synchronized successfully.');

    // Close the database connection
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase(); 