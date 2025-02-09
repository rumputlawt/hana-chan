import { buttonComponent } from "../utils/messageComponents.ts";
import { replyInteraction } from "~/utils/interaction.ts";
import { MessageFlags, Utils } from "@discordjs/core";
import { verifyMember } from "~/utils/verification.ts";

export default buttonComponent({
	customId: "verification",
	execute(interaction) {
		if (!Utils.isGuildInteraction(interaction)) {
			return replyInteraction({ content: "what??" });
		} else {
			queueMicrotask(() => verifyMember(interaction.member));
			return replyInteraction({
				content: "Thank youu <3!!!",
				flags: MessageFlags.Ephemeral,
			});
		}
	},
});
