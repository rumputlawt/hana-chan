import { walk } from "@std/fs/walk";
import { Mode } from "fresh";

export async function build(mode: Mode) {
	const commandFiles = await Array.fromAsync(
		walk("./commands", {
			includeDirs: false,
			includeSymlinks: false,
			exts: ["ts"],
		}),
	);

	const manifest = `
    ${
		commandFiles.map((ctx, id) => `import $${id} from "~/${ctx.path}";`)
			.join("\n")
	}
    
    export default {
        commands: [
            ${commandFiles.map((_ctx, id) => `$${id}`).join(",\n")}
        ]
    }`;

	const manifestFile = mode === "production" ? "bot.gen.ts" : "dev.gen.ts";

	await Deno.writeTextFile(
		manifestFile,
		manifest,
	);
	await new Deno.Command(Deno.execPath(), { args: ["fmt", manifestFile] })
		.output();
}
