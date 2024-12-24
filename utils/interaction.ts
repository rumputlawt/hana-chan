import {
	type APIInteractionResponseCallbackData,
	type APIInteractionResponseChannelMessageWithSource,
	APIInteractionResponseDeferredChannelMessageWithSource,
	APIMessageApplicationCommandInteraction,
	InteractionResponseType,
	MessageFlags,
} from "@discordjs/core";

export function retrieveResolvedMessage(
	interaction: APIMessageApplicationCommandInteraction,
) {
	return interaction.data.resolved.messages[interaction.data.target_id];
}

export function deferReplyInteraction(
	ephemeral?: boolean,
): APIInteractionResponseDeferredChannelMessageWithSource {
	return {
		type: InteractionResponseType.DeferredChannelMessageWithSource,
		data: {
			flags: ephemeral ? MessageFlags.Ephemeral : undefined,
		},
	};
}

export function replyInteraction(
	data: APIInteractionResponseCallbackData,
): APIInteractionResponseChannelMessageWithSource {
	return { type: InteractionResponseType.ChannelMessageWithSource, data };
}
