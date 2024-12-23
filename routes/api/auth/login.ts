import { HttpError } from "fresh";
import { STATUS_CODE } from "@std/http/status";
import { bot, define } from "~/utils/core.ts";
import { createSession, hasRequestedScopes } from "~/utils/auth.ts";
import { API, PermissionFlagsBits } from "@discordjs/core";
import { REST } from "@discordjs/rest";
import { computeBasePermissions, hasPermissions } from "~/utils/permissions.ts";

export const handler = define.handlers({
	async GET(ctx) {
		const code = ctx.url.searchParams.get("code");

		if (!code) {
			throw new HttpError(STATUS_CODE.Unauthorized);
		} else {
			const clientId = Deno.env.get("BOT_ID");
			const clientSecret = Deno.env.get("BOT_SECRET");
			const guildId = Deno.env.get("GUILD_ID");
			const redirectUrl = Deno.env.get("REDIRECT_URI");

			if (!clientId || !clientSecret || !guildId || !redirectUrl) {
				throw new Error(
					'Missing "BOT_ID" or "BOT_SECRET" or "GUILD_ID" or "REDIRECT_URI" environment variable.',
				);
			} else {
				const exchanged = await bot.oauth2.tokenExchange({
					client_id: clientId,
					client_secret: clientSecret,
					code,
					grant_type: "authorization_code",
					redirect_uri: redirectUrl,
				});

				if (!hasRequestedScopes(exchanged.scope)) {
					throw new HttpError(
						STATUS_CODE.BadRequest,
						"Invalid scope",
					);
				} else {
					const oauth = new API(
						new REST({ authPrefix: "Bearer" }).setToken(
							exchanged.access_token,
						),
					);

					const member = await oauth.users.getGuildMember(guildId);
					const guild = await bot.guilds.get(guildId);

					const memberPermissions = computeBasePermissions(
						member,
						guild,
					);
					const eligible = hasPermissions(memberPermissions, [
						PermissionFlagsBits.ManageGuild,
					]);

					if (eligible) {
						return await createSession(member);
					} else {
						throw new HttpError(
							STATUS_CODE.Forbidden,
							"Only admins can access this dashboard. 🙏🏻",
						);
					}
				}
			}
		}
	},
});
