const { Sequelize, Model, DataTypes } = require('sequelize');
// const db = new Sequelize('sqlite::memory:');
const path = require('path')
const db = process.env.NODE_ENV === 'test'
    ? new Sequelize('sqlite::memory:', null, null, {dialect: 'sqlite'})
    : new Sequelize({dialect: 'sqlite', storage: path.join(__dirname, 'data.db')})

// class Restaurant extends Model {}
// class Menu extends Model {}
// class Item extends Model {}

const Restaurant = db.define('restaurant', {
    name: DataTypes.STRING,
    image: DataTypes.STRING
})

const Menu = db.define('menu', {
    title: DataTypes.STRING,
})

const Item = db.define('item', {
    name: DataTypes.STRING,
    price: DataTypes.FLOAT
})

Restaurant.hasMany(Menu)
Menu.belongsTo(Restaurant)

Menu.hasMany(Item)
Item.belongsTo(Menu)

// Restaurant.init({
//     name: DataTypes.STRING, 
//     image: DataTypes.STRING
// }, {sequelize: db})

// Menu.init({
//     title: DataTypes.STRING
// }, {sequelize: db})

// Item.init({
//     name: DataTypes.STRING,
//     price: DataTypes.FLOAT
// }, {sequelize: db})

module.exports = { Restaurant, Item, Menu, db }