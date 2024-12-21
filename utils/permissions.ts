import {
	type APIGuild,
	type APIGuildMember,
	PermissionFlagsBits,
} from "@discordjs/core";

const ALL_PERMISSIONS = Object.values(PermissionFlagsBits).reduce(
	(prev, current) => prev | current,
	0n,
);

export function computeBasePermissions(
	member: APIGuildMember,
	guild: APIGuild,
) {
	if (guild.owner_id === member.user.id) {
		return ALL_PERMISSIONS;
	} else {
		const everyone = guild.roles.find((role) => role.id === guild.id)!;
		let permissions = BigInt(everyone.permissions);

		for (const roleId of member.roles) {
			const role = guild.roles.find((role) => role.id === roleId)!;
			permissions |= BigInt(role.permissions);
		}

		if (
			(permissions & PermissionFlagsBits.Administrator) ==
				PermissionFlagsBits.Administrator
		) {
			return ALL_PERMISSIONS;
		} else {
			return permissions;
		}
	}
}

export function hasPermissions(
	permissions: bigint,
	requiredPermissions: bigint[],
) {
	return requiredPermissions.every((permission) =>
		(permissions & permission) == permission
	);
}
