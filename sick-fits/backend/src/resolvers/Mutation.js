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
};

module.exports = Mutations;
