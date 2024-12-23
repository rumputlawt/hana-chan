import { define } from "~/utils/core.ts";

export default define.page(({ Component, state }) => {
	const { title } = state;
	const renderedTitle = title ? `${state.title} - Hana` : "Hana";

	return (
		<html>
			<head>
				<meta charset="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<meta name="theme-color" content="#A2D1FE" />
				<title>{renderedTitle}</title>
				<meta property="og:title" content={renderedTitle} />
				<meta property="twitter:image" content="/banner.png" />
				<meta property="twitter:card" content="summary_large_image" />
				{state.description && (
					<>
						<meta
							property="og:description"
							content={state.description}
						/>
						<meta
							property="twitter:description"
							content={state.description}
						/>
					</>
				)}
				<link rel="stylesheet" href="/styles.css" />
			</head>
			<body>
				<Component />
			</body>
		</html>
	);
});
