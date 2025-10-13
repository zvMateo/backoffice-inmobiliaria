type QueryParams = Record<string, string | number | boolean | undefined | null>;

function buildQuery(params?: QueryParams): string {
	if (!params) return "";
	const usp = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value === undefined || value === null) return;
		usp.set(key, String(value));
	});
	const qs = usp.toString();
	return qs ? `?${qs}` : "";
}

async function request<T>(path: string, init?: RequestInit & { query?: QueryParams }): Promise<T> {
	const { query, ...rest } = init || {};
	const qs = buildQuery(query);
	const url = `/api/proxy/${path.replace(/^\//, "")}${qs}`;

	const headers = new Headers(rest.headers);
	if (!(rest.body instanceof FormData) && !headers.has("Content-Type") && rest.method && rest.method !== "GET") {
		headers.set("Content-Type", "application/json");
	}

	const res = await fetch(url, { ...rest, headers });
	const contentType = res.headers.get("content-type") || "";
	const isJson = contentType.includes("application/json");
	if (!res.ok) {
		let details: any = undefined;
		try {
			details = isJson ? await res.json() : await res.text();
		} catch {}
		throw new Error(`API ${res.status}: ${res.statusText} - ${typeof details === "string" ? details : JSON.stringify(details)}`);
	}
	return (isJson ? res.json() : (res.text() as any)) as Promise<T>;
}

export function apiGet<T>(path: string, query?: QueryParams, init?: RequestInit) {
	return request<T>(path, { ...init, method: "GET", query });
}

export function apiPost<T>(path: string, body?: any, init?: RequestInit) {
	return request<T>(path, { ...init, method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) });
}

export function apiPut<T>(path: string, body?: any, init?: RequestInit) {
	return request<T>(path, { ...init, method: "PUT", body: body instanceof FormData ? body : JSON.stringify(body) });
}

export function apiPatch<T>(path: string, body?: any, init?: RequestInit) {
	return request<T>(path, { ...init, method: "PATCH", body: body instanceof FormData ? body : JSON.stringify(body) });
}

export function apiDelete<T>(path: string, init?: RequestInit) {
	return request<T>(path, { ...init, method: "DELETE" });
}




