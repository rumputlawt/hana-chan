import { messageContextMenuCommand } from "~/utils/command.ts";
import {
	deferReplyInteraction,
	replyInteraction,
	retrieveResolvedMessage,
} from "~/utils/interaction.ts";
import { MessageFlags, MessageType } from "@discordjs/core";
import { reportMessage } from "~/utils/report.ts";

export default messageContextMenuCommand({
	data: {
		name: "report",
	},
	execute(interaction) {
		const message = retrieveResolvedMessage(interaction);

		switch (message.type) {
			case MessageType.Reply:
			case MessageType.ChatInputCommand:
			case MessageType.ThreadStarterMessage:
			case MessageType.Default: {
				queueMicrotask(() => reportMessage(interaction, message));
				return deferReplyInteraction(true);
			}
			default: {
				return replyInteraction({
					content: "You can't report non-user message",
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	},
});
