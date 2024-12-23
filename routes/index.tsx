import { bot, define } from "~/utils/core.ts";
import { Deploy } from "~/islands/deploy.tsx";
import { page } from "fresh";
import { calculateUserDefaultAvatarIndex } from "@discordjs/rest";

export const handler = define.handlers({
	GET(ctx) {
		const { member } = ctx.state;

		if (!member) {
			ctx.state.description =
				"A dashboard web for admins @ Nori Discord Server🌸";
			return page({ member });
		} else {
			const avatar = member.user.avatar
				? bot.rest.cdn.avatar(member.user.id, member.user.avatar)
				: bot.rest.cdn.defaultAvatar(
					calculateUserDefaultAvatarIndex(member.user.id),
				);
			return page({ member, avatar });
		}
	},
});

export default define.page<typeof handler>(({ data }) => {
	if (data.member) {
		return (
			<div class="flex flex-col h-dvh gap-2 p-3">
				<div class="flex justify-between">
					<div class="size-10">
						<img src="/logo.png" />
					</div>
					<img class="size-10 rounded-full" src={data.avatar} />
				</div>
				<p class="mt-2 text-lg font-bold">
					Welcome {data.member.nick ?? data.member.user.global_name ??
						data.member.user.username}! 👋
				</p>
				<div class="flex flex-col gap-2">
					<Deploy />
				</div>
			</div>
		);
	} else {
		return (
			<div class="flex flex-col h-dvh justify-center items-center gap-3">
				<img class="pointer-events-none size-20" src="/logo.png" />
				<div class="flex flex-col items-center gap-2">
					<p class="font-bold text-lg">Login to access Dashboard!</p>
					<div>
						<a
							class="bg-black px-4 py-2 text-white text-sm font-semibold rounded-full"
							href="/login"
						>
							Login with Discord
						</a>
					</div>
				</div>
			</div>
		);
	}
});
