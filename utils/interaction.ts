import {
	APIApplicationCommandInteractionDataOption,
	APIApplicationCommandInteractionDataStringOption,
	type APIInteractionResponseCallbackData,
	type APIInteractionResponseChannelMessageWithSource,
	APIInteractionResponseDeferredChannelMessageWithSource,
	APIMessageApplicationCommandInteraction,
	ApplicationCommandOptionType,
	InteractionResponseType,
	MessageFlags,
} from "@discordjs/core";

export function getStringOption(
	options: APIApplicationCommandInteractionDataOption[],
	name: string,
): APIApplicationCommandInteractionDataStringOption | undefined {
	return options.find((opt) =>
		opt.name === name && opt.type === ApplicationCommandOptionType.String
	) as APIApplicationCommandInteractionDataStringOption;
}

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
