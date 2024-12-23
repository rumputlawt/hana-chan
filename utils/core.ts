import { createDefine } from "fresh";
import { type Command } from "~/utils/command.ts";
import { API, type APIGuildMember } from "@discordjs/core";
import { REST } from "@discordjs/rest";

export interface State {
	member?: APIGuildMember;
	error?: string;
	title?: string;
	description?: string;
}

export const define = createDefine<State>();

export const bot = new API(new REST().setToken(Deno.env.get("BOT_TOKEN")!));

export interface Manifest {
	default: {
		commands: Command[];
	};
}
