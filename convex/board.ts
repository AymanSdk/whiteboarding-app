// ? Provider imports
import { v } from 'convex/values';
// ? Local imports
import { mutation } from './_generated/server';
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

		// TODO: check to delete favorite relation

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
