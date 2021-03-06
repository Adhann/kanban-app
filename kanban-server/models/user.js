'use strict';
const {
  Model
} = require('sequelize');

const {hashPass} = require('../helpers/bcrypt')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Task, { foreignKey: "UserId" })
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        notEmpty: {
          args: true,
          msg: 'The Email field is required'
        }
      },
      unique: {
        args: true,
        msg: 'Email already registered'
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6],
          msg: 'Minimum password length of 6 characters'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (user, opt) => {
        user.password = hashPass(user.password)
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};