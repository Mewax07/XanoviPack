import { defaultFetcher, Fetcher } from "~f0/index";
import { Queue } from "~p0/definitions/private/queue";
import type { InstanceParameters, SessionHandle, SessionInformation, UserParameters, UserResource } from "~p0/models";

/**
 * Creates a session handle with default values.
 *
 * @param fetcher The fetcher to use for the current session handle.
 * @returns A session handle with default value (empty session).
 */
export const createSessionHandle = (fetcher: Fetcher = defaultFetcher): SessionHandle => {
	return {
		information: {} as SessionInformation,
		instance: {} as InstanceParameters,
		user: {} as UserParameters,

		userResource: {} as UserResource,

		queue: new Queue(),
		fetcher,

		presence: null,
	};
};
