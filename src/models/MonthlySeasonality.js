import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const MonthlySeasonality = sequelize.define('MonthlySeasonality', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'compositeIndex'
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: 'compositeIndex',
    validate: {
      min: 1,
      max: 12
    }
  },
  averageReturn: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  sampleSize: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Number of months used to calculate the average'
  },
  lastUpdated: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['symbol', 'month']
    }
  ],
  timestamps: true
});

export default MonthlySeasonality; 