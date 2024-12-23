import { type APIGuildMember, OAuth2Scopes } from "@discordjs/core";
import { importPKCS8, importSPKI, jwtVerify, SignJWT } from "jose";
import { setCookie } from "@std/http/cookie";
import { STATUS_CODE } from "@std/http/status";
import { bot } from "~/utils/core.ts";

const JWT_ALG = "RS256";
const REQUESTED_SCOPES = [
	OAuth2Scopes.GuildsMembersRead,
];

export function hasRequestedScopes(scope: string) {
	const parsedScopes = scope.split(" ");
	return REQUESTED_SCOPES.every((ctx) => parsedScopes.includes(ctx));
}

export function createAuthUrl() {
	const clientId = Deno.env.get("BOT_ID");
	const redirectUrl = Deno.env.get("REDIRECT_URI");

	if (!clientId || !redirectUrl) {
		throw new Error(
			'Missing "BOT_ID" or "REDIRECT_URI" environment variable.',
		);
	} else {
		return bot.oauth2.generateAuthorizationURL({
			client_id: clientId,
			prompt: "consent",
			response_type: "code",
			redirect_uri: redirectUrl,
			scope: REQUESTED_SCOPES.join(" "),
		});
	}
}

export async function createToken(member: APIGuildMember) {
	const privateKey = Deno.env.get("JWT_PRIVATE_KEY");

	if (!privateKey) {
		throw new Error('Missing "JWT_PRIVATE_KEY" environment variable.');
	} else {
		const encodedKey = await importPKCS8(privateKey, JWT_ALG);

		const expire = (Math.floor(Date.now()) / 1000) + (60 * 60);
		const jwt = new SignJWT({ ...member }).setProtectedHeader({
			typ: "JWT",
			alg: JWT_ALG,
		}).setExpirationTime(expire);

		return {
			expire,
			data: await jwt.sign(encodedKey),
		};
	}
}

export async function resolveToken(token: string) {
	const publicKey = Deno.env.get("JWT_PUBLIC_KEY");

	if (!publicKey) {
		throw new Error('Missing "JWT_PUBLIC_KEY" environment variable.');
	} else {
		const encodedKey = await importSPKI(publicKey, JWT_ALG);

		const data = await jwtVerify<APIGuildMember>(token, encodedKey);
		return data.payload;
	}
}

export async function createSession(member: APIGuildMember) {
	const token = await createToken(member);

	const headers = new Headers({ location: "/" });

	setCookie(headers, {
		name: "access_token",
		value: token.data,
		expires: token.expire * 1000,
		path: "/",
	});

	return new Response(null, { headers, status: STATUS_CODE.Found });
}
