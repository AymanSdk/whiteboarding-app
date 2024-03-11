// * Provider imports
import { v } from 'convex/values';
// * Local imports
import { mutation, query } from './_generated/server';
// ? Images array for random image selection
const images = [
	'/placeholders/1.svg',
	'/placeholders/2.svg',
	'/placeholders/3.svg',
	'/placeholders/4.svg',
	'/placeholders/5.svg',
	'/placeholders/6.svg',
	'/placeholders/7.svg',
	'/placeholders/8.svg',
	'/placeholders/9.svg',
	'/placeholders/10.svg'
];

export const create = mutation({
	args: {
		orgId: v.string(),
		title: v.string()
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		// ? check if there is no user identity
		if (!identity) {
			throw new Error('Not authorized');
		}
		const randomImage = images[Math.floor(Math.random() * images.length)];

		const board = await ctx.db.insert('boards', {
			title: args.title,
			orgId: args.orgId,
			authorId: identity.subject,
			authorName: identity.name!,
			imageUrl: randomImage
		});

		return board;
	}
});

// ? <---- creating of a delete mutation ---->

export const remove = mutation({
	args: { id: v.id('boards') },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error('Not authorized');
		}

		const userId = identity.subject;

		const existingFavorite = await ctx.db
			.query('userFavorites')
			.withIndex('by_user_board', (q) =>
				q.eq('userId', userId).eq('boardId', args.id)
			)
			.unique();

		if (existingFavorite) {
			await ctx.db.delete(existingFavorite._id);
		}

		await ctx.db.delete(args.id);
	}
});

// ? <---- creating of an update mutation ---->

export const update = mutation({
	args: { id: v.id('boards'), title: v.string() },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		//? check if there is no user identity
		if (!identity) {
			throw new Error('Not authorized');
		}
		//? trim the title
		const title = args.title.trim();
		//  ? check if the title is empty
		if (!title) {
			throw new Error('Title cannot be empty');
		}
		// ? check if the title is more than 60 characters
		if (title.length > 60) {
			throw new Error('Title cannot be more than 60 characters');
		}
		//  ? update the board with the new title
		const board = await ctx.db.patch(args.id, {
			title: args.title
		});

		return board;
	}
});

// ? <---- creating of a favorite mutation ---->

export const favorite = mutation({
	args: { id: v.id('boards'), orgId: v.string() },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error('Not authorized');
		}

		const board = await ctx.db.get(args.id);

		if (!board) {
			throw new Error('Board not found');
		}

		const userId = identity.subject;

		const existingFavorite = await ctx.db
			.query('userFavorites')
			.withIndex('by_user_board', (q) =>
				q.eq('userId', userId).eq('boardId', board._id)
			)
			.unique();

		if (existingFavorite) {
			throw new Error('Board already favorited');
		}

		await ctx.db.insert('userFavorites', {
			userId,
			boardId: board._id,
			orgId: args.orgId
		});

		return board;
	}
});

// ? <---- creating of an unfavorite mutation ---->

export const unfavorite = mutation({
	args: { id: v.id('boards') },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error('Not authorized');
		}

		const board = await ctx.db.get(args.id);

		if (!board) {
			throw new Error('Board not found');
		}

		const userId = identity.subject;

		const existingFavorite = await ctx.db
			.query('userFavorites')
			.withIndex('by_user_board', (q) =>
				q.eq('userId', userId).eq('boardId', board._id)
			)
			.unique();

		if (!existingFavorite) {
			throw new Error('Favorited board not found');
		}

		await ctx.db.delete(existingFavorite._id);

		return board;
	}
});

export const get = query({
	args: { id: v.id('boards') },
	handler: async (ctx, args) => {
		const board = ctx.db.get(args.id);

		return board;
	}
});
