const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {
    async createItem(parent, args, ctx, info) {
        // TODO Check if they are logged in

        const item = await ctx.db.mutation.createItem({
            data: {
                title: args.title,
                description: args.description,
                price: args.price,
                image: args.image,
                largeImage: args.largeImage
                // ...args
            }
        }, info);
        
        return item;
    },

    updateItem(parent, args, ctx, info) {
        // First take a copy of the updates
        const updates = {...args};
        // Remove the ID from the updates
        delete updates.id
        // Run de update method
        return ctx.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id
            }
        }, info);
    },

    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id };

        // Find the item
        const item = await ctx.db.query.item({ where }, `{ id title }`);
        // Check if they own that item or have the permissions
        // TODO
        // Delete it!
        return ctx.db.mutation.deleteItem({ where }, info);
    },

    async signup(parent, args, ctx, info) {
        // Lowercase their email
        args.email = args.email.toLowerCase();

        // Hash their password
        const password = await bcrypt.hash(args.password, 10);

        // Create the user in the DB
        const user = await ctx.db.mutation.createUser({
            data: {
                // name: args.name,
                // email: args.email,
                // password: args.password
                ...args,
                password: password,
                permissions: { set: ['USER'] }
            }
        }, info);

        // Create the JWT toekn from them
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

        // We set the jwt as a cookie on the response
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000*60*60*24*365, // 1 year cookie
        })

        // We return the user to the browser
        return user;
    },
};

module.exports = Mutations;
