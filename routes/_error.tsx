import { page } from "fresh";
import { define } from "~/utils/core.ts";

export const handler = define.handlers((ctx) => {
	const errorMessage = (ctx.error as Error).message;

	ctx.state.title = errorMessage;
	return page({ errorMessage });
});

export default define.page<typeof handler>(({ data }) => {
	const { errorMessage } = data;

	return (
		<div class="flex flex-col h-dvh justify-center items-center">
			<p class="text-lg font-bold">Oops..</p>
			<p class="font-semibold">{errorMessage}</p>
		</div>
	);
});
