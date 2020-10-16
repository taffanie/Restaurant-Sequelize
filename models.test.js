const { beforeAll, expect } = require('@jest/globals');
const { get } = require('http');
const { Restaurant, Menu, Item, db } = require('./models')
const data = require('./restaurants.json')

// ----- CREATE TABLES || WITH SEED DATA -----

// beforeAll(async () => {
//     await db.sync()
// })

beforeAll(async () => {
    await db.sync().then(async () => {
        const taskQueue = data.map(async (json_restaurant) => {
                const restaurant = await Restaurant.create({name: json_restaurant.name, image: json_restaurant.image})
                const menus = await Promise.all(json_restaurant.menus.map(async (_menu) => {
                    const items = await Promise.all(_menu.items.map(({name, price}) => Item.create({name, price})))
                    const menu = await Menu.create({title: _menu.title})
                    return menu.setItems(items)
                }))
                return await restaurant.setMenus(menus)
            })
        return Promise.all(taskQueue)
    })
})

// ----- START TESTS -----

describe('Restaurant', () => {
    test('new restaurants are created with an id', async () => {
        const restaurant = await Restaurant.create({name: "Fruits & Seeds", image: "image.url"})
        expect(restaurant.id).toBe(9)
    });
});

describe('Menu', () => {
    test('new menus are created with an id', async () => {
        const menu = await Menu.create({title: "Brunch Menu"})
        expect(menu.id).toBe(19)
    });
});

describe('Item', () => {
    test('new items are created with an id', async () => {
        const item = await Item.create({name: "Fig Salad", price: 6.50})
        expect(item.id).toBe(85)
    });
});

// ----- RELATIONSHIP TESTS -----

describe('Relationships', () => {
    test('restaurants have menus', async () => {
        const restaurant = await Restaurant.create({name: "Grains & Greens", image: "image.url"})
        const menu = await Menu.create({title: "Vegan Menu"})
        await restaurant.addMenu(menu) // adds restaurantId to menu automatically
        const menus = await restaurant.getMenus()
        expect(menus[0].title).toBe("Vegan Menu")
    });
    test('menus have items', async () => {
        const restaurant = await Restaurant.create({name: "Grains & Greens", image: "image.url"})
        const menu = await Menu.create({title: "Vegan Menu"})
        const item = await Item.create({name: "Rocket Salad", price: 7.50})
        await restaurant.addMenu(menu) 
        const menus = await restaurant.getMenus()
        await menu.addItem(item) // adds menuId to item automatically 
        const items = await menu.getItems()
        expect(items[0].name).toBe("Rocket Salad")
    });
});

// ---- FANCY RELATIONSHIP TESTS -----

describe('Fancy Relationships', () => {
    test('a restaurant has many menus', async () => {
        const restaurant = await Restaurant.findOne({
            where: {
                name: "Bayroot"
            },
            include: [
                {model: Menu, as: 'menus'}
            ]
        })
        expect(restaurant.name).toBe("Bayroot")
        expect(restaurant.menus).toBeTruthy
        expect(restaurant.menus[0].title).toBe("Grill")
    });
    test('a menu has many items', async () => {
        const menu = await Menu.findOne({
            where: {
                title: "Afternoon tea"
            },
            include: 
                'items'
        })
        expect(menu.title).toBe("Afternoon tea")
        expect(menu.items).toBeTruthy
        expect(menu.items[0].name).toBe("Prêt-à-Portea")
    });
    test('a restaurant has many menus which has many items', async () => {
        const restaurant = await Restaurant.findOne({where: {name: "Cafe Monico"}, include:[{all: true, nested: true}]})
        expect(restaurant.menus.length).toBe(3)
        expect(restaurant.menus[0].items[0].name).toBe("Chicken Liver Parfait")
    });
});