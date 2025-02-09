import {
	APIChatInputApplicationCommandGuildInteraction,
	APIGuildMember,
	ButtonStyle,
	ComponentType,
} from "@discordjs/core";
import { bot } from "~/utils/core.ts";
import { createWelcomeImage } from "~/utils/welcome.ts";
import { userMention } from "@discordjs/formatters";

export async function createVerificationMessage(
	interaction: APIChatInputApplicationCommandGuildInteraction,
) {
	await bot.channels.createMessage(interaction.channel.id, {
		content: "Have you read the rules?",
		components: [{
			type: ComponentType.ActionRow,
			components: [{
				type: ComponentType.Button,
				label: "Got it.",
				style: ButtonStyle.Primary,
				custom_id: "verification",
			}],
		}],
	});
	await bot.interactions.editReply(
		interaction.application_id,
		interaction.token,
		{ content: "Done!" },
	);
}

export async function verifyMember(member: APIGuildMember) {
	const guildId = Deno.env.get("GUILD_ID");
	const memberRole = Deno.env.get("MEMBER_ROLE_ID");
	const welcomeChannelId = Deno.env.get("WELCOME_CHANNEL_ID");

	if (!guildId || !memberRole || !welcomeChannelId) {
		throw new Error(
			'Missing "GUILD_ID" or "MEMBER_ROLE_ID" or "WELCOME_CHANNEL_ID" environment variable.',
		);
	} else {
		if (!member.roles.includes(memberRole)) {
			await bot.guilds.addRoleToMember(
				guildId,
				member.user.id,
				memberRole,
			);

			const welcomeImage = await createWelcomeImage(member.user);
			await bot.channels.createMessage(welcomeChannelId, {
				content: userMention(member.user.id),
				files: [{
					name: "welcome.png",
					data: welcomeImage,
				}],
			});
		}
	}
}
