import tweetnacl from "tweetnacl";
import { decodeHex } from "@std/encoding/hex";
import { STATUS_CODE } from "@std/http/status";
import {
	type APIChatInputApplicationCommandInteraction,
	type APIInteraction,
	APIMessageApplicationCommandInteraction,
	APIMessageComponentButtonInteraction,
	APIUserApplicationCommandInteraction,
	InteractionResponseType,
	InteractionType,
} from "@discordjs/core";
import { define } from "~/utils/core.ts";
import { HttpError, type RouteConfig } from "fresh";
import {
	CommandResponse,
	isMessageContextMenuCommand,
	isSlashCommand,
	isUserContextMenuCommand,
	loadCommands,
} from "~/utils/command.ts";
import { replyInteraction } from "~/utils/interaction.ts";
import {
	isButtonComponent,
	loadMessageComponents,
} from "~/utils/messageComponents.ts";

export const config: RouteConfig = {
	skipAppWrapper: true,
};

export const handler = define.handlers({
	async POST(ctx) {
		const timestamp = ctx.req.headers.get("x-signature-timestamp");
		const signature = ctx.req.headers.get("x-signature-ed25519");
		const publicKey = Deno.env.get("BOT_PUBLIC_KEY");

		if (!timestamp || !signature || !publicKey) {
			throw new HttpError(
				STATUS_CODE.Unauthorized,
				"Missing timestamp, signature or public key.",
			);
		} else {
			const body = await ctx.req.text();

			const valid = tweetnacl.sign.detached.verify(
				new TextEncoder().encode(timestamp + body),
				decodeHex(signature),
				decodeHex(publicKey),
			);

			if (!valid) {
				throw new HttpError(
					STATUS_CODE.Unauthorized,
					"Invalid signature.",
				);
			} else {
				const interaction: APIInteraction = JSON.parse(body);

				switch (interaction.type) {
					case InteractionType.Ping: {
						return Response.json({
							type: InteractionResponseType.Pong,
						});
					}
					case InteractionType.ApplicationCommand: {
						const commands = await loadCommands(ctx.config.mode);
						const command = commands.find((command) =>
							command.data.name === interaction.data.name &&
							command.data.type === interaction.data.type
						);

						let response: CommandResponse = replyInteraction({
							content: "command not found??",
						});

						if (command) {
							if (isSlashCommand(command)) {
								response = await command.execute(
									interaction as APIChatInputApplicationCommandInteraction,
								);
							} else if (isMessageContextMenuCommand(command)) {
								response = await command.execute(
									interaction as APIMessageApplicationCommandInteraction,
								);
							} else if (isUserContextMenuCommand(command)) {
								response = await command.execute(
									interaction as APIUserApplicationCommandInteraction,
								);
							}
						}

						return Response.json(response);
					}
					case InteractionType.MessageComponent: {
						const messageComponents = await loadMessageComponents(
							ctx.config.mode,
						);
						const component = messageComponents.find((component) =>
							interaction.data.custom_id ===
								component.data.customId &&
							interaction.data.component_type ===
								component.data.type
						);

						let response: CommandResponse = replyInteraction({
							content: "component not found??",
						});

						if (component) {
							if (isButtonComponent(component)) {
								response = await component.execute(
									interaction as APIMessageComponentButtonInteraction,
								);
							}
						}

						return Response.json(response);
					}
					default: {
						return new Response(null, {
							status: STATUS_CODE.NotImplemented,
						});
					}
				}
			}
		}
	},
});
