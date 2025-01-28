import {
	APIChatInputApplicationCommandGuildInteraction,
	OverwriteType,
	PermissionFlagsBits,
} from "@discordjs/core";
import { bot } from "~/utils/core.ts";
import { getStringOption } from "~/utils/interaction.ts";

export async function lockChannel(
	interaction: APIChatInputApplicationCommandGuildInteraction,
) {
	const message = getStringOption(interaction.data.options ?? [], "message");
	await bot.channels.editPermissionOverwrite(
		interaction.channel.id,
		interaction.guild_id,
		{
			type: OverwriteType.Role,
			deny: String(PermissionFlagsBits.SendMessages),
		},
		{
			reason:
				`Locked by @${interaction.member.user.username} (${interaction.member.user.id})`,
		},
	);

	await bot.channels.createMessage(interaction.channel.id, {
		content: `${
			message?.value ?? "This channel has been locked."
		}\n-# Locked by @${interaction.member.user.username}`,
	});
	await bot.interactions.editReply(
		interaction.application_id,
		interaction.token,
		{ content: "Locked" },
	);
}
