import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import RequireAuth from "./RequireAuth";
import { AuthContext } from "../context/AuthContext";

const renderAt = (path, user) =>
  render(
    <AuthContext.Provider value={{ user }}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/login" element={<p>Login page</p>} />
          <Route element={<RequireAuth />}>
            <Route path="/games/:gameId" element={<p>Game page</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );

describe("RequireAuth", () => {
  it("redirects a guest to the login page", () => {
    renderAt("/games/1", null);

    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Game page")).not.toBeInTheDocument();
  });

  it("shows the protected page to a logged-in user", () => {
    renderAt("/games/1", { id: 2, role: "player" });

    expect(screen.getByText("Game page")).toBeInTheDocument();
  });
});
