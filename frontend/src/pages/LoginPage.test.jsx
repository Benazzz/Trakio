import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";
import LoginPage from "./LoginPage";
import { AuthContext } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";

const renderLogin = (login) =>
  render(
    <AuthContext.Provider value={{ user: null, login }}>
      <ToastProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/games" element={<p>Games page</p>} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </AuthContext.Provider>,
  );

const fillAndSubmit = async (user) => {
  await user.type(screen.getByLabelText("Email"), "tomas@trakio.lt");
  await user.type(screen.getByLabelText("Password"), "Trakio123!");
  await user.click(screen.getByRole("button", { name: "Log in" }));
};

describe("LoginPage", () => {
  it("logs in with the entered credentials and opens the games list", async () => {
    const login = vi.fn().mockResolvedValue();
    const user = userEvent.setup();
    renderLogin(login);

    await fillAndSubmit(user);

    expect(login).toHaveBeenCalledWith("tomas@trakio.lt", "Trakio123!");
    expect(await screen.findByText("Games page")).toBeInTheDocument();
    expect(screen.getByText("Logged in")).toBeInTheDocument();
  });

  it("shows the server's error message and stays on the page", async () => {
    const login = vi.fn().mockRejectedValue({
      response: { data: { error: "Invalid email or password" } },
    });
    const user = userEvent.setup();
    renderLogin(login);

    await fillAndSubmit(user);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid email or password",
    );
    expect(screen.getByRole("button", { name: "Log in" })).toBeEnabled();
    expect(screen.queryByText("Games page")).not.toBeInTheDocument();
  });
});
