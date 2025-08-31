export const ForumAction = {
	DELETE: 2,
	SIGNAL: 4,
} as const;

export type ForumAction = (typeof ForumAction)[keyof typeof ForumAction];

export const ForumActionNames = Object.fromEntries(Object.entries(ForumAction).map(([k, v]) => [v, k])) as Record<
	ForumAction,
	keyof typeof ForumAction
>;
