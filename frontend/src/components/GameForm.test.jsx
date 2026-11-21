import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GameForm from "./GameForm";
import { getZones } from "../api/zones";

vi.mock("../api/zones", () => ({ getZones: vi.fn() }));

const EMPTY_GAME = {
  name: "",
  zone_id: "",
  max_players: 4,
  head_start_min: 15,
  is_public: true,
  is_locked: false,
};

describe("GameForm", () => {
  beforeEach(() => {
    vi.mocked(getZones).mockResolvedValue([
      { id: 1, city: "Kaunas", name: "Old Town" },
      { id: 2, city: "Kaunas", name: "Žaliakalnis" },
    ]);
  });

  it("submits a new game with numeric fields converted to numbers", async () => {
    const onSubmit = vi.fn().mockResolvedValue();
    const user = userEvent.setup();
    render(<GameForm initialValues={EMPTY_GAME} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Name"), "Friday chase");
    await user.selectOptions(
      await screen.findByLabelText("Zone"),
      await screen.findByRole("option", { name: "Kaunas · Žaliakalnis" }),
    );
    await user.clear(screen.getByLabelText("Max players"));
    await user.type(screen.getByLabelText("Max players"), "6");
    await user.click(screen.getByLabelText("Public game"));
    await user.click(screen.getByRole("button", { name: "Create game" }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Friday chase",
      zone_id: 2,
      max_players: 6,
      head_start_min: 15,
      is_public: false,
    });
  });

  it("in edit mode sends is_locked instead of zone_id", async () => {
    const onSubmit = vi.fn().mockResolvedValue();
    const user = userEvent.setup();
    render(
      <GameForm
        initialValues={{ ...EMPTY_GAME, name: "Old game", zone_id: 1 }}
        onSubmit={onSubmit}
        isEdit
      />,
    );

    expect(screen.queryByLabelText("Zone")).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("Locked lobby"));
    await user.click(screen.getByRole("button", { name: "Save" }));

    const sent = onSubmit.mock.calls[0][0];
    expect(sent).toMatchObject({ name: "Old game", is_locked: true });
    expect(sent).not.toHaveProperty("zone_id");
  });

  it("shows the first validation detail returned by the API", async () => {
    const onSubmit = vi.fn().mockRejectedValue({
      response: {
        data: {
          error: "Validation failed",
          details: [{ message: "Name must be at least 3 characters" }],
        },
      },
    });
    const user = userEvent.setup();
    render(<GameForm initialValues={{ ...EMPTY_GAME, name: "ab", zone_id: 1 }} onSubmit={onSubmit} isEdit />);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Name must be at least 3 characters",
    );
  });
});
