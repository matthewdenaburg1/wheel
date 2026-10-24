import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Sector from "./Sector";

describe("Sector Component", () => {
  it("renders the person name", () => {
    render(<Sector name="Alice" index={0} sectorAngle={60} radius={500} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("applies correct background color, rotation, and clip path for a sector", () => {
    const { container } = render(
      <Sector name="Bob" index={1} sectorAngle={90} radius={500} />
    );

    const slice = container.firstChild as HTMLElement;
    expect(slice).toBeInTheDocument();
    // For index 1 and sectorAngle 90: hue = 1 * 90 = 90
    expect(slice).toHaveStyle({ backgroundColor: "hsl(90, 100%, 45%)" });
    // Rotation = 1 * 90 - 90 / 2 = 45deg
    expect(slice.style.transform).toBe("rotate(45deg)");
    // clipPath should contain an SVG path starting with M
    expect(slice.style.clipPath).toContain('path("M');
    // For 90 degrees (<= 180), largeArcFlag should be 0
    expect(slice.style.clipPath).toContain(" 0 0 1 ");
  });

  it("sets largeArcFlag to 1 when sectorAngle > 180", () => {
    const { container } = render(
      <Sector name="Charlie" index={0} sectorAngle={270} radius={500} />
    );

    const slice = container.firstChild as HTMLElement;
    // For 270 degrees (> 180), largeArcFlag should be 1
    expect(slice.style.clipPath).toContain(" 0 1 1 ");
  });

  it("rotates the name text to counteract sector rotation", () => {
    render(<Sector name="Dana" index={2} sectorAngle={120} radius={400} />);

    const nameElement = screen.getByText("Dana");
    expect(nameElement.style.transform).toBe("rotate(60deg)");
    expect(nameElement.style.transformOrigin).toBe("left");
  });

  it("applies light text style for light backgrounds and dark text style for dark backgrounds", () => {
    // Yellow hue (60 deg) is a light background -> styles.light applied
    const { rerender } = render(
      <Sector name="Bright" index={1} sectorAngle={60} radius={500} />
    );
    const brightName = screen.getByText("Bright");
    expect(brightName.className).toContain("light");

    // Blue hue (240 deg) is a dark background -> styles.dark applied
    rerender(<Sector name="Dark" index={2} sectorAngle={120} radius={500} />);
    const darkName = screen.getByText("Dark");
    expect(darkName.className).toContain("dark");
  });
});
