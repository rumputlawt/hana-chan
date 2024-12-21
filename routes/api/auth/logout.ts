import { deleteCookie } from "@std/http/cookie";
import { STATUS_CODE } from "@std/http/status";
import { define } from "~/utils/core.ts";

export const handler = define.handlers({
	GET(_ctx) {
		const headers = new Headers({ location: "/" });
		deleteCookie(headers, "access_token", { path: "/" });

		return new Response(null, { headers, status: STATUS_CODE.Found });
	},
});
