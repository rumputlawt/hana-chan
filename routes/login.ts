import { define } from "~/utils/core.ts";
import { createAuthUrl } from "~/utils/auth.ts";

export const handler = define.handlers({
	GET(ctx) {
		return ctx.redirect(createAuthUrl());
	},
});
