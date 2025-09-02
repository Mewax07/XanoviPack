import { Headers } from "undici/lib/web/fetch/headers.js";

import { HeaderMap, kHeaders } from "./headers";
HeaderMap[kHeaders] = Headers;
export { HeaderMap };

import { factory } from "./factory";
import { fetcher } from "./fetchers/undici";

export { HeaderKeys } from "./headers";
export { HttpRequest } from "./request";
export { HttpResponse } from "./response";

export const send = factory(fetcher);