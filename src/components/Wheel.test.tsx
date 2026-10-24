import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

  it('does not invoke onSpinEnd when spinning with no enabled people', () => {
    const onSpinEnd = vi.fn();
    const people: Person[] = [
      { id: 1, name: 'Alice', enabled: false },
    ];

    renderWheel(people, { isSpinning: true, onSpinEnd });

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onSpinEnd).not.toHaveBeenCalled();
  });

  describe('Responsive Scaling', () => {
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;

    afterEach(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalInnerWidth });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: originalInnerHeight });
    });

    it('scales the wheel based on vertical space when there is more horizontal space than vertical', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1000 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 500 });

      renderWheel([]);

      const wheelContainer = screen.getByTestId('wheel-container');
      const wheelScaler = wheelContainer.parentElement;

      // targetSize = min(500 * 0.7 = 350, 1000 * 0.6 = 600, 500) = 350
      // scale = 350 / 500 = 0.7
      expect(wheelScaler).toHaveStyle({ width: '350px', height: '350px' });
      expect(wheelContainer).toHaveStyle({ transform: 'scale(0.7)' });
    });

    it('caps the wheel scale at 1 when height is large in horizontal orientation', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1200 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 900 });

      renderWheel([]);

      const wheelContainer = screen.getByTestId('wheel-container');
      const wheelScaler = wheelContainer.parentElement;

      expect(wheelScaler).toHaveStyle({ width: '500px', height: '500px' });
      expect(wheelContainer).toHaveStyle({ transform: 'scale(1)' });
    });

    it('dynamically responds when window resize event is triggered', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1000 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 600 });

      renderWheel([]);

      const wheelContainer = screen.getByTestId('wheel-container');
      const wheelScaler = wheelContainer.parentElement;

      // 600 * 0.7 = 420
      expect(wheelScaler).toHaveStyle({ width: '420px', height: '420px' });
      expect(wheelContainer).toHaveStyle({ transform: 'scale(0.84)' });

      // Resize window height to 400
      act(() => {
        Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 400 });
        window.dispatchEvent(new Event('resize'));
      });

      // 400 * 0.7 = 280
      expect(wheelScaler).toHaveStyle({ width: '280px', height: '280px' });
      expect(wheelContainer).toHaveStyle({ transform: 'scale(0.56)' });
    });

    it('scales based on horizontal space when there is more vertical space than horizontal', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 400 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 800 });

      renderWheel([]);

      const wheelContainer = screen.getByTestId('wheel-container');
      const wheelScaler = wheelContainer.parentElement;

      // min(400 * 0.65 = 260, 300) = 260
      // scale = 260 / 500 = 0.52
      expect(wheelScaler).toHaveStyle({ width: '260px', height: '260px' });
      expect(wheelContainer).toHaveStyle({ transform: 'scale(0.52)' });
    });
  });
});
