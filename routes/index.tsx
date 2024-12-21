import { define } from "~/utils/core.ts";
import { Deploy } from "~/islands/deploy.tsx";
import { page } from "fresh";
import { createAuthUrl } from "~/utils/auth.ts";

export const handler = define.handlers({
	GET(ctx) {
		if (!ctx.state.member) {
			return ctx.redirect(createAuthUrl());
		} else {
			return page();
		}
	},
});

export default define.page<typeof handler>((_ctx) => {
	return (
		<div class="flex h-dvh p-2">
			<Deploy />
		</div>
	);
});
