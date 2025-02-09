import { slashCommand } from "~/utils/command.ts";
import { MessageFlags, PermissionFlagsBits, Utils } from "@discordjs/core";
import { createVerificationMessage } from "~/utils/verification.ts";
import {
	deferReplyInteraction,
	replyInteraction,
} from "~/utils/interaction.ts";

export default slashCommand({
	data: {
		name: "create-verify",
		description: "Create verification button",
		default_member_permissions: String(PermissionFlagsBits.ManageGuild),
	},
	execute(interaction) {
		if (!Utils.isGuildInteraction(interaction)) {
			return replyInteraction({
				content: "nuh uh",
				flags: MessageFlags.Ephemeral,
			});
		} else {
			queueMicrotask(() => createVerificationMessage(interaction));
			return deferReplyInteraction(true);
		}
	},
});
