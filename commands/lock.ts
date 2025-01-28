import { slashCommand } from "~/utils/command.ts";
import {
	ApplicationCommandOptionType,
	PermissionFlagsBits,
	Utils,
} from "@discordjs/core";
import {
	deferReplyInteraction,
	replyInteraction,
} from "~/utils/interaction.ts";
import { lockChannel } from "~/utils/lockChannel.ts";

export default slashCommand({
	data: {
		name: "lock",
		description: "Lock the chat",
		default_member_permissions: String(PermissionFlagsBits.ManageMessages),
		options: [
			{
				name: "message",
				description: "Why do u want to lock this channel?",
				type: ApplicationCommandOptionType.String,
			},
		],
	},
	execute(interaction) {
		if (!Utils.isGuildInteraction(interaction)) {
			return replyInteraction({
				content: "how can you use this command on DM!!",
			});
		} else {
			queueMicrotask(() => lockChannel(interaction));
			return deferReplyInteraction(true);
		}
	},
});
