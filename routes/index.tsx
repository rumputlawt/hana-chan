import { bot, define } from "~/utils/core.ts";
import { Deploy } from "~/islands/deploy.tsx";
import { page } from "fresh";
import { createAuthUrl } from "~/utils/auth.ts";
import { calculateUserDefaultAvatarIndex } from "@discordjs/rest";

export const handler = define.handlers({
	GET(ctx) {
		const { member } = ctx.state;

		if (!member) {
			return ctx.redirect(createAuthUrl());
		} else {
			const avatar = member.user.avatar
				? bot.rest.cdn.avatar(member.user.id, member.user.avatar)
				: bot.rest.cdn.defaultAvatar(
					calculateUserDefaultAvatarIndex(member.user.id),
				);
			return page({ avatar });
		}
	},
});

export default define.page<typeof handler>(({ data }) => {
	const { avatar } = data;

	return (
		<div class="flex flex-col h-dvh p-3">
			<div class="flex justify-between">
				<div class="size-10 rounded-full bg-black"></div>
				<img class="size-10 rounded-full" src={avatar} />
			</div>
			<div class="flex flex-col gap-2 mt-4">
				<Deploy />
			</div>
		</div>
	);
});
