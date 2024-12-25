import {
	type APIMessage,
	type APIMessageApplicationCommandInteraction,
	APIThreadChannel,
	ButtonStyle,
	ComponentType,
	RESTJSONErrorCodes,
} from "@discordjs/core";
import {
	channelMention,
	messageLink,
	roleMention,
	userMention,
} from "@discordjs/formatters";
import { bot, kv } from "~/utils/core.ts";
import { avatar } from "~/utils/avatar.ts";
import { DiscordAPIError } from "@discordjs/rest";
import { embedColor } from "~/config.ts";

export async function reportMessage(
	interaction: APIMessageApplicationCommandInteraction,
	message: APIMessage,
) {
	const botId = Deno.env.get("BOT_ID");
	const reportChannelId = Deno.env.get("REPORT_CHANNEL_ID");

	if (!botId || !reportChannelId) {
		throw new Error(
			'Missing "BOT_ID" or "REPORT_CHANNEL_ID" environment variable.',
		);
	} else {
		const webhooks = await bot.channels.getWebhooks(reportChannelId);
		let botWebhook = webhooks.find((ctx) => ctx.user?.id);

		if (!botWebhook) {
			botWebhook = await bot.channels.createWebhook(reportChannelId, {
				name: "Reports",
			});
		}

		const { author, content, embeds, attachments, poll, id: messageId } =
			message;

		const reportKey = ["reports", "messages", messageId];
		const reportId = await kv.get<string>(reportKey);

		if (reportId.value) {
			try {
				const thread = await bot.channels.get(
					reportId.value,
				) as APIThreadChannel;

				if (
					!thread.thread_metadata?.archived &&
					!thread.thread_metadata?.locked
				) {
					await bot.interactions.editReply(
						interaction.application_id,
						interaction.token,
						{
							content:
								"Someone has reported this message already.",
						},
					);
					return;
				} else {
					await bot.channels.edit(thread.id, {
						archived: false,
						locked: false,
					});
					await bot.channels.createMessage(thread.id, {
						embeds: [{
							color: embedColor,
							author: {
								name: `${
									interaction.member!.user.username
								} reopened this report`,
								icon_url: avatar(interaction.member!.user),
							},
						}],
					});
					await bot.interactions.editReply(
						interaction.application_id,
						interaction.token,
						{
							content:
								"Archived thread for this report has been reopened",
						},
					);
					return;
				}
			} catch (err) {
				if (err instanceof DiscordAPIError) {
					if (err.code !== RESTJSONErrorCodes.UnknownChannel) {
						throw err;
					}
				} else {
					throw err;
				}
			}
		}

		if (interaction.member?.user.id === author.id) {
			await bot.interactions.editReply(
				interaction.application_id,
				interaction.token,
				{ content: "You can't report yourself yk?" },
			);
		} else {
			const report = await bot.webhooks.execute(
				botWebhook.id,
				botWebhook.token!,
				{
					allowed_mentions: {
						parse: [],
					},
					attachments,
					avatar_url: avatar(author),
					content: content.trim(),
					embeds,
					poll,
					thread_name:
						`A message has been reported @ ${interaction.channel.name}`,
					username: author.username,
					wait: true,
				},
			);

			await kv.set(reportKey, report.id, {
				expireIn: 30 * 24 * 60 * 60 * 1000,
			});

			const moderatorRole = Deno.env.get("MODERATOR_ROLE_ID");
			await bot.channels.createMessage(report.channel_id, {
				content: `⚠️ A message has been reported! ${
					moderatorRole ? roleMention(moderatorRole) : ""
				}`,
				embeds: [{
					color: embedColor,
					author: {
						name: interaction.member!.user.username,
						icon_url: avatar(interaction.member!.user),
					},
					description: `Chnanel: ${
						channelMention(interaction.channel.id)
					}\n\nReported by: ${
						userMention(interaction.member!.user.id)
					}\nReported user: ${userMention(author.id)}`,
				}],
				components: [{
					type: ComponentType.ActionRow,
					components: [{
						type: ComponentType.Button,
						style: ButtonStyle.Link,
						label: "Jump to message",
						url: messageLink(interaction.channel.id, messageId),
					}],
				}],
			});
			await bot.interactions.editReply(
				interaction.application_id,
				interaction.token,
				{ content: "Your report has been recorded." },
			);
		}
	}
}
