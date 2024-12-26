import { bot, define } from "~/utils/core.ts";
import { loadCommands } from "~/utils/command.ts";
import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";

export const handler = define.handlers({
	async POST(ctx) {
		if (!ctx.state.member) {
			throw new HttpError(STATUS_CODE.Unauthorized);
		} else {
			const botId = Deno.env.get("BOT_ID");
			const guildId = Deno.env.get("GUILD_ID");

			if (!botId || !guildId) {
				throw new HttpError(
					STATUS_CODE.InternalServerError,
					'Missing "BOT_ID" or "GUILD_ID" environment variable.',
				);
			} else {
				try {
					const commands = await loadCommands(ctx.config.mode);
					await bot.applicationCommands
						.bulkOverwriteGuildCommands(
							botId,
							guildId,
							commands.map((command) => command.data),
						);
					return new Response(null, {
						status: STATUS_CODE.NoContent,
					});
				} catch (err) {
					return Response.json(err, {
						status: STATUS_CODE.InternalServerError,
					});
				}
			}
		}
	},
});
