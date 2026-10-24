import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import App from "./App";
import * as urlUtils from "./utils/url";

vi.mock("canvas-confetti", () => ({
  default: vi.fn()
}));

describe("App Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("renders title, controls, wheel, and github link with default 6 people", () => {
    vi.spyOn(urlUtils, "loadNamesFromUrl").mockReturnValue([]);

    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Wheel of Names" })
    ).toBeInTheDocument();
    expect(screen.getByText("Click to Spin!")).toBeInTheDocument();
    expect(screen.getByTitle("Share")).toBeInTheDocument();
    expect(screen.getByTitle("Toggle theme")).toBeInTheDocument();
    expect(screen.getByTitle("Import")).toBeInTheDocument();
    expect(screen.getByText("Fork me on GitHub")).toBeInTheDocument();

    for (let i = 1; i <= 6; i++) {
      expect(screen.getAllByText(`Person ${i}`).length).toBeGreaterThanOrEqual(
        1
      );
    }
  });

  it("initializes people from URL when present", () => {
    vi.spyOn(urlUtils, "loadNamesFromUrl").mockReturnValue([
      "CustomNameA",
      "CustomNameB"
    ]);

    render(<App />);

    expect(screen.getAllByText("CustomNameA").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("CustomNameB").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("Person 1")).not.toBeInTheDocument();
  });

  it("handles spin flow, reveals winner, and disables winner on dismissal", () => {
    vi.spyOn(urlUtils, "loadNamesFromUrl").mockReturnValue(["SoloWinner"]);

    const { container } = render(<App />);

    expect(screen.queryByText("Next up is...")).not.toBeInTheDocument();

    // Click wheel to spin
    const wheelContainer = screen.getByTestId("wheel-container");
    fireEvent.click(wheelContainer);

    // Advance spin duration (1500ms)
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Winner modal should appear
    expect(screen.getByText("Next up is...")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "SoloWinner" })
    ).toBeInTheDocument();

    // Close winner overlay
    const overlay = container.querySelector(`div[class*="winnerOverlay"]`);
    expect(overlay).toBeInTheDocument();
    fireEvent.click(overlay!);

    // Winner modal is removed
    expect(screen.queryByText("Next up is...")).not.toBeInTheDocument();

    // Person should now be disabled in NameList
    const personItem = container.querySelector(`div[class*="person"]`);
    expect(personItem?.className).toContain("disabled");
  });

  it("assigns round-robin order and shows the completion message", () => {
    vi.spyOn(urlUtils, "loadNamesFromUrl").mockReturnValue(["SoloWinner"]);
    localStorage.setItem("appMode", "round-robin");

    const { container } = render(<App />);
    fireEvent.click(screen.getByTestId("wheel-container"));
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    fireEvent.click(container.querySelector(`div[class*='winnerOverlay']`)!);

    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("Round Complete!")).toBeInTheDocument();
    expect(screen.getByText("Everyone has been called.")).toBeInTheDocument();
    expect(screen.getByLabelText("Locked")).toBeInTheDocument();

    fireEvent.click(container.querySelector(`div[class*='winnerOverlay']`)!);
    expect(screen.queryByText("Round Complete!")).not.toBeInTheDocument();
    expect(screen.getByText("#1")).toBeInTheDocument();
  });

  it("resets ordered and disabled people when switching back to normal mode", () => {
    vi.spyOn(urlUtils, "loadNamesFromUrl").mockReturnValue(["SoloWinner"]);
    localStorage.setItem("appMode", "round-robin");

    const { container } = render(<App />);
    fireEvent.click(screen.getByTestId("wheel-container"));
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    fireEvent.click(container.querySelector(`div[class*='winnerOverlay']`)!);

    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    fireEvent.click(screen.getByRole("button", { name: /Mode: Round Robin/ }));
    fireEvent.click(screen.getByRole("button", { name: "Normal" }));

    expect(screen.queryByText("#1")).not.toBeInTheDocument();
    expect(
      container.querySelector(`div[class*='person']`)?.className
    ).not.toContain("disabled");
  });

  it("does not spin when there are no enabled people", () => {
    vi.spyOn(urlUtils, "loadNamesFromUrl").mockReturnValue(["OnlyOne"]);

    const { container } = render(<App />);

    // Disable the only person via NameList item
    const personLabel = container.querySelector("#checkbox-0") as HTMLElement;
    fireEvent.click(personLabel);

    // Attempt to spin
    const wheelContainer = screen.getByTestId("wheel-container");
    fireEvent.click(wheelContainer);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.queryByText("Next up is...")).not.toBeInTheDocument();
  });

  it("toggles theme between dark and light mode", () => {
    vi.spyOn(urlUtils, "loadNamesFromUrl").mockReturnValue([]);

    const { container } = render(<App />);

    const appRoot = container.firstChild as HTMLElement;
    expect(appRoot.className).toContain("dark-mode");

    // Click toggle theme button
    fireEvent.click(screen.getByTitle("Toggle theme"));
    expect(appRoot.className).toContain("light-mode");

    // Toggle back
    fireEvent.click(screen.getByTitle("Toggle theme"));
    expect(appRoot.className).toContain("dark-mode");
  });
});
