import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useAppModeState } from "./AppModeContext";

const AppModeHarness = () => {
  const [mode, setMode] = useAppModeState();

  return (
    <>
      <span>{mode}</span>
      <button onClick={() => setMode("round-robin")}>Set Round Robin</button>
    </>
  );
};

describe("useAppModeState", () => {
  it("loads a valid saved mode and persists changes", () => {
    localStorage.setItem("appMode", "normal");
    render(<AppModeHarness />);

    expect(screen.getByText("normal")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Set Round Robin" }));
    expect(screen.getByText("round-robin")).toBeInTheDocument();
    expect(localStorage.getItem("appMode")).toBe("round-robin");
  });

  it("loads a valid saved mode", () => {
    localStorage.setItem("appMode", "round-robin");
    render(<AppModeHarness />);

    expect(screen.getByText("round-robin")).toBeInTheDocument();
  });

  it("defaults to normal when local storage contains an invalid mode", () => {
    localStorage.setItem("appMode", "unknown");
    render(<AppModeHarness />);

    expect(screen.getByText("normal")).toBeInTheDocument();
  });
});
