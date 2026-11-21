import { beforeEach, describe, expect, it, vi } from "vitest";
import { axiosClient } from "./client";
import { refresh } from "./auth";
import { getRefreshToken, setAccessToken, setRefreshToken } from "./tokens";

vi.mock("./auth", () => ({ refresh: vi.fn() }));

// Replaces the network layer: each test decides how the "server" answers.
const respond = (handler) => {
  axiosClient.defaults.adapter = async (config) => {
    const { status, data } = await handler(config);
    const response = { status, data, headers: {}, config, statusText: "" };
    if (status >= 400) {
      const error = new Error(`Request failed with status ${status}`);
      error.config = config;
      error.response = response;
      throw error;
    }
    return response;
  };
};

// Like the real refresh(): stores the new access token and returns it.
const refreshSucceeds = () =>
  vi.mocked(refresh).mockImplementation(async () => {
    setAccessToken("new-token");
    return "new-token";
  });

// The server accepts only "new-token"; anything else gets a 401.
const acceptOnlyNewToken = (config) =>
  config.headers.Authorization === "Bearer new-token"
    ? { status: 200, data: { ok: true } }
    : { status: 401, data: { error: "Token expired" } };

describe("axiosClient token refresh", () => {
  beforeEach(() => {
    vi.mocked(refresh).mockReset();
    setAccessToken("expired-token");
    setRefreshToken("refresh-token");
  });

  it("sends the access token in the Authorization header", async () => {
    setAccessToken("new-token");
    respond(acceptOnlyNewToken);

    const res = await axiosClient.get("/games");

    expect(res.data).toEqual({ ok: true });
    expect(refresh).not.toHaveBeenCalled();
  });

  it("refreshes the token after a 401 and retries the request", async () => {
    refreshSucceeds();
    respond(acceptOnlyNewToken);

    const res = await axiosClient.get("/games");

    expect(res.data).toEqual({ ok: true });
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("makes only one refresh call for parallel 401 responses", async () => {
    refreshSucceeds();
    respond(acceptOnlyNewToken);

    const results = await Promise.all([
      axiosClient.get("/games"),
      axiosClient.get("/zones"),
      axiosClient.get("/event-templates"),
    ]);

    expect(results.every((r) => r.status === 200)).toBe(true);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("clears the tokens and rejects when the refresh fails", async () => {
    vi.mocked(refresh).mockRejectedValue(new Error("Refresh token revoked"));
    respond(acceptOnlyNewToken);

    await expect(axiosClient.get("/games")).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(getRefreshToken()).toBeNull();
  });

  it("does not try to refresh when an /auth/ request returns 401", async () => {
    respond(() => ({ status: 401, data: { error: "Invalid credentials" } }));

    await expect(axiosClient.post("/auth/login", {})).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(refresh).not.toHaveBeenCalled();
  });
});
