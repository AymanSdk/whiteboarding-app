import { Liveblocks } from '@liveblocks/node';
import { ConvexHttpClient } from 'convex/browser';
import { auth, currentUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const liveblocks = new Liveblocks({
	secret:
		'sk_dev_1Cc4iOn8-sB_g8wRzvlpkH-4WcJbuhZfAFJMQ5nNQXspIIJ8_7tEF-oPkA_q3g0a'
});

export async function POST(request: Request) {
	const authorization = await auth(); // TODO: removing await here to see if it works
	const user = await currentUser();

	if (!authorization || !user) {
		return new Response('Unauthorized', { status: 403 });
	}

	const { room } = await request.json();
	const board = await convex.query(api.board.get, { id: room });

	if (board?.orgId !== authorization.orgId) {
		return new Response('Unauthorized', { status: 403 });
	}

	const userInfo = {
		name: user.firstName || 'Anonymous',
		picture: user.imageUrl
	};

	const session = liveblocks.prepareSession(user.id, { userInfo });

	if (room) {
		session.allow(room, session.FULL_ACCESS);
	}

	const { status, body } = await session.authorize();
	return new Response(body, { status });
}
