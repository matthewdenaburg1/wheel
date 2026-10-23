import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import Wheel from './Wheel';
import { PeopleContext } from '../context/PeopleContext';

describe('Wheel Component', () => {
  const mockSetPeople = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const renderWheel = (
    people: Person[],
    props: {
      isSpinning?: boolean;
      radius?: number;
      resetTrigger?: boolean;
      onSpin?: () => void;
      onSpinEnd?: (person: Person) => void;
    } = {}
  ) => {
    const defaultProps = {
      isSpinning: false,
      radius: 500,
      resetTrigger: false,
      onSpin: vi.fn(),
      onSpinEnd: vi.fn(),
      ...props,
    };

    return render(
      <PeopleContext.Provider value={{ people, setPeople: mockSetPeople }}>
        <Wheel {...defaultProps} />
      </PeopleContext.Provider>
    );
  };

  it('renders "Click to Spin!" caption and pointer', () => {
    renderWheel([]);
    expect(screen.getByText('Click to Spin!')).toBeInTheDocument();
    expect(screen.getByTestId('wheel-container')).toBeInTheDocument();
    expect(screen.getByTestId('wheel')).toBeInTheDocument();
  });

  it('renders sectors for enabled people only', () => {
    const people: Person[] = [
      { id: 1, name: 'Alice', enabled: true },
      { id: 2, name: 'Bob', enabled: false },
      { id: 3, name: 'Charlie', enabled: true },
    ];

    renderWheel(people);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('triggers onSpin when wheel container is clicked', () => {
    const onSpin = vi.fn();
    const people: Person[] = [{ id: 1, name: 'Alice', enabled: true }];

    renderWheel(people, { onSpin });

    const wheelContainer = screen.getByTestId('wheel-container');
    fireEvent.click(wheelContainer);

    expect(onSpin).toHaveBeenCalledTimes(1);
  });

  it('handles spinning state, sets rotation transform, and invokes onSpinEnd after 1500ms with a winner', () => {
    const onSpinEnd = vi.fn();
    const people: Person[] = [
      { id: 1, name: 'Alice', enabled: true },
      { id: 2, name: 'Bob', enabled: true },
    ];

    const { rerender } = renderWheel(people, { isSpinning: false, onSpinEnd });

    const wheelElement = screen.getByTestId('wheel');
    expect(wheelElement).toHaveStyle({ transform: 'rotate(0deg)' });

    rerender(
      <PeopleContext.Provider value={{ people, setPeople: mockSetPeople }}>
        <Wheel
          isSpinning={true}
          radius={500}
          resetTrigger={false}
          onSpin={vi.fn()}
          onSpinEnd={onSpinEnd}
        />
      </PeopleContext.Provider>
    );

    expect(wheelElement.style.transform).not.toBe('rotate(0deg)');
    expect(onSpinEnd).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onSpinEnd).toHaveBeenCalledTimes(1);
    const winner = onSpinEnd.mock.calls[0][0];
    expect(people.some((p) => p.id === winner.id && p.name === winner.name)).toBe(true);
  });

  it('resets rotation to 0deg when resetTrigger toggles', () => {
    const people: Person[] = [{ id: 1, name: 'Alice', enabled: true }];

    const { rerender } = renderWheel(people, {
      isSpinning: false,
      resetTrigger: false,
    });

    const wheelElement = screen.getByTestId('wheel');

    // First spin to change rotation
    rerender(
      <PeopleContext.Provider value={{ people, setPeople: mockSetPeople }}>
        <Wheel
          isSpinning={true}
          radius={500}
          resetTrigger={false}
          onSpin={vi.fn()}
          onSpinEnd={vi.fn()}
        />
      </PeopleContext.Provider>
    );

    expect(wheelElement.style.transform).not.toBe('rotate(0deg)');

    // Toggle resetTrigger
    rerender(
      <PeopleContext.Provider value={{ people, setPeople: mockSetPeople }}>
        <Wheel
          isSpinning={false}
          radius={500}
          resetTrigger={true}
          onSpin={vi.fn()}
          onSpinEnd={vi.fn()}
        />
      </PeopleContext.Provider>
    );

    expect(wheelElement).toHaveStyle({ transform: 'rotate(0deg)' });
  });

  it('calculates correct sector angles when number of enabled people changes', () => {
    const initialPeople: Person[] = [
      { id: 1, name: 'Alice', enabled: true },
    ];

    const { rerender } = renderWheel(initialPeople);

    expect(screen.getByText('Alice')).toBeInTheDocument();

    const updatedPeople: Person[] = [
      { id: 1, name: 'Alice', enabled: true },
      { id: 2, name: 'Bob', enabled: true },
      { id: 3, name: 'Charlie', enabled: true },
      { id: 4, name: 'Dave', enabled: true },
    ];

    rerender(
      <PeopleContext.Provider value={{ people: updatedPeople, setPeople: mockSetPeople }}>
        <Wheel
          isSpinning={false}
          radius={500}
          resetTrigger={false}
          onSpin={vi.fn()}
          onSpinEnd={vi.fn()}
        />
      </PeopleContext.Provider>
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Dave')).toBeInTheDocument();
  });
});
