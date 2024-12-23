import { useState } from "preact/hooks";

export function Deploy() {
	const [status, setStatus] = useState<
		"deploying" | "success" | "failed" | "null"
	>("null");

	return (
		<div class="flex justify-between items-center p-2 outline outline-black rounded-lg">
			<div class="flex flex-col gap-1">
				<p class="text-md font-semibold">Deploy Commands</p>
				<p class="text-sm">Sync application commands to discord.</p>
			</div>
			<div class="flex items-center gap-2">
				{status === "success" && (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="25"
						height="25"
						viewBox="0 0 512 512"
					>
						<path
							fill="#000"
							d="m173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69L432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001"
						/>
					</svg>
				)}
				<button
					class="bg-black px-4 py-1.5 text-white rounded-full disabled:opacity-50"
					onClick={async () => {
						setStatus("deploying");
						const result = await fetch("/api/deploy", {
							method: "POST",
						});
						setStatus(result.status === 204 ? "success" : "failed");
					}}
					disabled={status === "deploying"}
				>
					{status === "deploying" ? "Deploying" : "Deploy"}
				</button>
			</div>
		</div>
	);
}
