const { beforeAll, expect } = require('@jest/globals');
const { get } = require('http');
const { Restaurant, Menu, Item, db } = require('./models')

// ----- CREATE TABLES -----

beforeAll(async () => {
    await db.sync()
})

// ----- START TESTS -----

describe('Restaurant', () => {
    test('new restaurants are created with an id', async () => {
        const restaurant = await Restaurant.create({name: "Fruits & Seeds", image: "image.url"})
        expect(restaurant.id).toBe(1)
    });
});

describe('Menu', () => {
    test('new menus are created with an id', async () => {
        const menu = await Menu.create({title: "Brunch Menu"})
        expect(menu.id).toBe(1)
    });
});

describe('Item', () => {
    test('new items are created with an id', async () => {
        const item = await Item.create({name: "Fig Salad", price: 6.50})
        expect(item.id).toBe(1)
    });
});

// ----- RELATIONSHIP TESTS -----

describe('Relationships', () => {
    test('restaurants have menus', async () => {
        const restaurant = await Restaurant.create({name: "Grains & Greens", image: "image.url"})
        const menu = await Menu.create({title: "Vegan Menu"})
        await restaurant.addMenu(menu)
        const menus = await restaurant.getMenus()
        expect(menus[0].title).toBe("Vegan Menu")
    });
    test('menus have items', async () => {
        const restaurant = await Restaurant.create({name: "Grains & Greens", image: "image.url"})
        const menu = await Menu.create({title: "Vegan Menu"})
        const item = await Item.create({name: "Rocket Salad", price: 7.50})
        await restaurant.addMenu(menu)
        const menus = await restaurant.getMenus()
        await menu.addItem(item)
        const items = await menu.getItems()
        expect(items[0].name).toBe("Rocket Salad")
    });
});