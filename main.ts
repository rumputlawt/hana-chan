import { App, fsRoutes, staticFiles, trailingSlashes } from "fresh";
import { type State } from "~/utils/core.ts";
import { getCookies } from "@std/http/cookie";
import { resolveToken } from "~/utils/auth.ts";

export const app = new App<State>();
app.use(staticFiles());
app.use(trailingSlashes("never"));

app.use(async (ctx) => {
	const token = getCookies(ctx.req.headers)["access_token"];

	try {
		const member = await resolveToken(token);
		ctx.state.member = member;
	} catch (err) {
		ctx.state.error = (err as Error).message;
	}

	return await ctx.next();
});

await fsRoutes(app, {
	dir: "./",
	loadIsland: (path) => import(`./islands/${path}`),
	loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
	await app.listen();
}
