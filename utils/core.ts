import { createDefine } from "fresh";
import { type Command } from "~/utils/command.ts";
import { API, type APIGuildMember } from "@discordjs/core";
import { REST } from "@discordjs/rest";
import { MessageComponent } from "~/utils/messageComponents.ts";

export interface State {
	member?: APIGuildMember;
	error?: string;
	title?: string;
	description?: string;
}

export const define = createDefine<State>();
export const kv = await Deno.openKv();
export const bot = new API(new REST().setToken(Deno.env.get("BOT_TOKEN")!));

export interface Manifest {
	default: {
		commands: Command[];
		messageComponents: MessageComponent[];
	};
}
