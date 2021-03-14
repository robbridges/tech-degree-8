'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Book.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // Validation to make sure that the title of the book is not empty
        notEmpty: {
          msg: "Book title cannot be empty"
         }
       }
      },
    author: { 
      type: DataTypes.STRING,
      allowNull: false,
      //Validation to make sure that the author is not empty
      validate: {
        notEmpty: {
          msg: "Book Author cannot be empty"
        }
      }
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};