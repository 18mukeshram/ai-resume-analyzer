const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Analysis = sequelize.define('Analysis', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  resumeName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  jobDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  resumeText: {
    type: DataTypes.TEXT,
  },
  matchScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  matchedSkills: {
    type: DataTypes.TEXT, // JSON stored as text for SQLite compatibility
    get() {
      const val = this.getDataValue('matchedSkills');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('matchedSkills', JSON.stringify(val));
    },
  },
  missingSkills: {
    type: DataTypes.TEXT,
    get() {
      const val = this.getDataValue('missingSkills');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('missingSkills', JSON.stringify(val));
    },
  },
  improvements: {
    type: DataTypes.TEXT,
    get() {
      const val = this.getDataValue('improvements');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('improvements', JSON.stringify(val));
    },
  },
  interviewQuestions: {
    type: DataTypes.TEXT,
    get() {
      const val = this.getDataValue('interviewQuestions');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('interviewQuestions', JSON.stringify(val));
    },
  },
  summary: {
    type: DataTypes.TEXT,
  },
});

// Relationship
Analysis.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Analysis, { foreignKey: 'userId' });

module.exports = Analysis;
