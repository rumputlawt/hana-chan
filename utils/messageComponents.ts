import {
	APIMessageComponentButtonInteraction,
	APIMessageComponentInteraction,
	ComponentType,
} from "@discordjs/core";
import { Mode } from "fresh";
import { CommandResponse } from "~/utils/command.ts";
import { Manifest } from "~/utils/core.ts";

export async function loadMessageComponents(mode: Mode) {
	const { default: { messageComponents } }: Manifest = await import(
		`~/${mode === "production" ? "bot.gen.ts" : "dev.gen.ts"}`
	);
	return messageComponents;
}

export function buttonComponent(
	{ customId, execute }: BaseMessageComponent<
		APIMessageComponentButtonInteraction
	>,
) {
	return { data: { customId, type: ComponentType.Button }, execute };
}

// TODO: support for select menus

export function isButtonComponent(
	component: MessageComponent,
): component is ReturnType<typeof buttonComponent> {
	return component.data.type === ComponentType.Button;
}

interface BaseMessageComponent<
	Interaction extends APIMessageComponentInteraction,
> {
	customId: string;
	execute: (interaction: Interaction) => CommandResponse;
}

export type MessageComponent = ReturnType<typeof buttonComponent>;
