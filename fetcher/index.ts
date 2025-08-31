import * as setCookie from "set-cookie-parser";

export const findValueBetween = (
    plain: string,
    start: string,
    end: string
): string | null => {
    let pos = plain.indexOf(start);
    if (pos === -1) return null;
    pos += start.length;
    const endPos = plain.indexOf(end, pos);
    if (endPos === -1) return null;
    return plain.slice(pos, endPos);
};

export type ReactNativeFileFromURI = {
    uri: string;
    name: string;
    type: string;
    size: number;
};

export type FormDataFile =
    | Blob
    | File
    | Buffer
    | ArrayBuffer
    | Uint8Array
    | ReactNativeFileFromURI;

export interface HeadersLike {
    get(key: string): string | null;
}

export const getCookiesFromResponse = (response: Response): string[] => {
    const value = getHeaderFromResponse(response, "set-cookie");
    return value === null
        ? []
        : setCookie
              .splitCookiesString(value)
              .map((cookie) => cookie.split(";")[0]);
};

export const getHeaderFromResponse = (
    response: Response,
    item: string
): string | null => {
    const h = response.headers;
    return isHeadersLike(h) ? h.get(item) : (h as Record<string, string>)[item];
};

export const setCookiesArrayToRequest = (
    request: Request,
    cookies: string[]
) => {
    setHeaderToRequest(request, "Cookie", cookies.join("; "));
};

export const setCookiesObjectToRequest = (
    request: Request,
    cookies: Record<string, string>
) => {
    const arr = Object.entries(cookies).map(([k, v]) => `${k}=${v}`);
    setCookiesArrayToRequest(request, arr);
};

export const setHeaderToRequest = (
    request: Request,
    key: string,
    value: string
) => {
    if (!request.headers) request.headers = {};
    if (isHeadersLike(request.headers)) {
        (request.headers as Headers).set(key, value);
    } else {
        (request.headers as Record<string, string>)[key] = value;
    }
};

function isHeadersLike(obj: any): obj is Headers | HeadersLike {
    return typeof obj?.get === "function";
}

export interface Request {
    url: URL;
    method?: "GET" | "POST";
    content?: string;
    headers?: Record<string, string> | Headers;
    redirect?: "follow" | "manual";
}

export interface Response {
    status: number;
    content: string;
    headers: Record<string, string> | Headers | HeadersLike;
}

export type Fetcher = (req: Request) => Promise<Response>;

export const defaultFetcher: Fetcher = async (req) => {
    const res = await fetch(req.url.href, {
        redirect: req.redirect ?? "follow",
        headers: req.headers ?? {},
        method: req.method ?? "GET",
        body: req.content,
    });

    return {
        status: res.status,
        content: await res.text(),
        headers: res.headers,
    };
};
