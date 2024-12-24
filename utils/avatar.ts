import { APIUser } from "@discordjs/core";
import { bot } from "~/utils/core.ts";
import { calculateUserDefaultAvatarIndex } from "@discordjs/rest";

export function avatar(user: APIUser) {
	return user.avatar
		? bot.rest.cdn.avatar(user.id, user.avatar)
		: bot.rest.cdn.defaultAvatar(calculateUserDefaultAvatarIndex(user.id));
}
