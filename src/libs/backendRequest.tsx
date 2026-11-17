type BackendRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  token?: string;
  body?: unknown;
};

export default async function backendRequest<T>(
  path: string,
  options: BackendRequestOptions = {}
): Promise<BackendResult<T>> {
  const headers: Record<string, string> = {};

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (options.token) {
    headers.authorization = `Bearer ${options.token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${process.env.BACKEND_URL}/api/v1${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
    });
  } catch {
    return {
      ok: false,
      status: 0,
      error: "Cannot reach the server right now. Try again in a moment.",
    };
  }

  const json = await response.json().catch(() => null);

  if (!response.ok || !json?.success) {
    return {
      ok: false,
      status: response.status,
      error: toFriendlyError(response.status, json?.error),
    };
  }

  return { ok: true, data: json.data as T };
}

function toFriendlyError(status: number, message: unknown) {
  if (status === 401) return "Your session has expired. Sign in again.";
  if (status === 403) return "You do not have permission to do this.";
  if (status === 429) return "Too many requests. Wait a few minutes and try again.";
  if (typeof message === "string" && message.includes("E11000")) return "DUPLICATE";
  if (typeof message === "string" && message.length > 0) return message;
  return "Something went wrong. Try again.";
}
