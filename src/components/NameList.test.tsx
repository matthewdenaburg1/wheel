import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NameList from "./NameList";
import { PeopleContext } from "../context/PeopleContext";
import { AppModeContext, type AppMode } from "../context/AppModeContext";

describe("NameList Component", () => {
  const renderNameList = (
    people: Person[],
    setPeople = vi.fn(),
    mode: AppMode = "normal"
  ) => {
    return render(
      <AppModeContext.Provider value={{ mode, setMode: vi.fn() }}>
        <PeopleContext.Provider value={{ people, setPeople }}>
          <NameList />
        </PeopleContext.Provider>
      </AppModeContext.Provider>
    );
  };

  it("renders empty list without crashing when people array is empty", () => {
    const { container } = renderNameList([]);
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders all people names and their action buttons", () => {
    const people: Person[] = [
      { id: 1, name: "Alice", enabled: true },
      { id: 2, name: "Bob", enabled: false }
    ];

    renderNameList(people);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("applies disabled styling to disabled people only", () => {
    const people: Person[] = [
      { id: 1, name: "Alice", enabled: true },
      { id: 2, name: "Bob", enabled: false }
    ];

    const { container } = renderNameList(people);

    const personElements = container.querySelectorAll(`div[class*="person"]`);
    expect(personElements).toHaveLength(2);
    expect(personElements[0].className).not.toContain("disabled");
    expect(personElements[1].className).toContain("disabled");
  });

  it("toggles person enabled status when clicking on name label", () => {
    const setPeople = vi.fn();
    const people: Person[] = [
      { id: 1, name: "Alice", enabled: true },
      { id: 2, name: "Bob", enabled: false }
    ];

    renderNameList(people, setPeople);

    // Click enabled person (Alice)
    fireEvent.click(screen.getByText("Alice"));
    expect(setPeople).toHaveBeenCalledTimes(1);
    expect(setPeople).toHaveBeenCalledWith([
      { id: 1, name: "Alice", enabled: false },
      { id: 2, name: "Bob", enabled: false }
    ]);

    // Click disabled person (Bob)
    fireEvent.click(screen.getByText("Bob"));
    expect(setPeople).toHaveBeenCalledTimes(2);
    expect(setPeople).toHaveBeenLastCalledWith([
      { id: 1, name: "Alice", enabled: true },
      { id: 2, name: "Bob", enabled: true }
    ]);
  });

  it("removes an enabled person when the delete button is clicked", () => {
    const setPeople = vi.fn();
    const people: Person[] = [
      { id: 1, name: "Alice", enabled: true },
      { id: 2, name: "Bob", enabled: true }
    ];

    renderNameList(people, setPeople);

    const deleteButtons = screen.getAllByRole("button");
    fireEvent.click(deleteButtons[0]);

    expect(setPeople).toHaveBeenCalledTimes(1);
    expect(setPeople).toHaveBeenCalledWith([
      { id: 2, name: "Bob", enabled: true }
    ]);
  });

  it("does not remove a disabled person when the delete button is clicked", () => {
    const setPeople = vi.fn();
    const people: Person[] = [{ id: 1, name: "Alice", enabled: false }];

    renderNameList(people, setPeople);

    const deleteButton = screen.getByRole("button");
    fireEvent.click(deleteButton);

    expect(setPeople).not.toHaveBeenCalled();
  });

  it("shows ordered people first and locks them in round-robin mode", () => {
    const setPeople = vi.fn();
    const people: Person[] = [
      { id: 1, name: "Alice", enabled: false, order: 2 },
      { id: 2, name: "Bob", enabled: true },
      { id: 3, name: "Charlie", enabled: false, order: 1 }
    ];

    const { container } = renderNameList(people, setPeople, "round-robin");
    const personRows = container.querySelectorAll('[class*="person"]');

    expect(
      container.querySelector('[class*="roundRobin"]')
    ).toBeInTheDocument();
    expect(personRows[0]).toHaveTextContent("#1");
    expect(personRows[0]).toHaveTextContent("Charlie");
    expect(personRows[1]).toHaveTextContent("#2");
    expect(personRows[1]).toHaveTextContent("Alice");
    expect(personRows[2]).toHaveTextContent("Bob");
    expect(screen.getAllByLabelText("Locked")).toHaveLength(2);
    expect(screen.getAllByRole("button")).toHaveLength(1);

    fireEvent.click(screen.getByText("Charlie"));
    fireEvent.click(screen.getAllByLabelText("Locked")[0]);
    expect(setPeople).not.toHaveBeenCalled();
  });
});
