import {
	type APIMessageApplicationCommandInteraction,
	ButtonStyle,
	ComponentType,
} from "@discordjs/core";
import {
	channelMention,
	messageLink,
	roleMention,
	userMention,
} from "@discordjs/formatters";
import { bot } from "~/utils/core.ts";
import { retrieveResolvedMessage } from "~/utils/interaction.ts";
import { avatar } from "~/utils/avatar.ts";

export async function reportMessage(
	interaction: APIMessageApplicationCommandInteraction,
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
			retrieveResolvedMessage(interaction);
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

		const moderatorRole = Deno.env.get("MODERATOR_ROLE_ID");
		await bot.channels.createMessage(report.channel_id, {
			content: `⚠️ A message has been reported! ${
				moderatorRole ? roleMention(moderatorRole) : ""
			}`,
			embeds: [{
				color: 0xA2D1FE,
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
