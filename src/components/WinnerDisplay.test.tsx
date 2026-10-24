import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import WinnerDisplay from "./WinnerDisplay";
import confetti from "canvas-confetti";

vi.mock("canvas-confetti", () => ({
  default: vi.fn()
}));

describe("WinnerDisplay Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when winner is null", () => {
    const { container } = render(
      <WinnerDisplay winner={null} onClose={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
    expect(confetti).not.toHaveBeenCalled();
  });

  it("renders winner announcement and triggers confetti when winner is provided", () => {
    const winner: Person = { id: 1, name: "Alice", enabled: true };
    const onClose = vi.fn();

    render(<WinnerDisplay winner={winner} onClose={onClose} />);

    expect(screen.getByText("Next up is...")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Alice"
    );
    expect(confetti).toHaveBeenCalledTimes(1);
    expect(confetti).toHaveBeenCalledWith({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 }
    });
  });

  it("calls onClose when clicking on the overlay", () => {
    const winner: Person = { id: 1, name: "Alice", enabled: true };
    const onClose = vi.fn();

    const { container } = render(
      <WinnerDisplay winner={winner} onClose={onClose} />
    );

    const overlay = container.firstChild as HTMLElement;
    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows the round-complete message without triggering confetti", () => {
    const onClose = vi.fn();
    render(<WinnerDisplay winner={null} isRoundComplete onClose={onClose} />);

    expect(
      screen.getByRole("heading", { name: "Round Complete!" })
    ).toBeInTheDocument();
    expect(screen.getByText("Everyone has been called.")).toBeInTheDocument();
    expect(confetti).not.toHaveBeenCalled();
  });
});
