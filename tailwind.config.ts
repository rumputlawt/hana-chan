import defaultTheme from "tailwindcss/defaultTheme.js";
import { type Config } from "tailwindcss";

export default {
	content: [
		"{routes,islands,components}/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				"sans": ["Poppins", ...defaultTheme.fontFamily.sans],
			},
		},
	},
} satisfies Config;
