import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Controls from './Controls';
import { PeopleContext } from '../context/PeopleContext';
import { AppModeContext, type AppMode } from '../context/AppModeContext';
import { shareUrl } from '../utils/url';

vi.mock('../utils/url', () => ({
  shareUrl: vi.fn(),
}));

describe('Controls Component', () => {
  const mockSetPeople = vi.fn();
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderControls = (
    people: Person[] = [],
    setPeople = mockSetPeople,
    onToggleTheme = mockToggleTheme,
    mode: AppMode = 'normal',
    setMode = vi.fn(),
  ) => {
    return render(
      <AppModeContext.Provider value={{ mode, setMode }}>
        <PeopleContext.Provider value={{ people, setPeople }}>
          <Controls onToggleTheme={onToggleTheme} />
        </PeopleContext.Provider>
      </AppModeContext.Provider>,
    );
  };

  it('renders menu buttons and default single name input', () => {
    renderControls();

    expect(screen.getByTitle('Share')).toBeInTheDocument();
    expect(screen.getByTitle('Toggle theme')).toBeInTheDocument();
    expect(screen.getByTitle('Import')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter a name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'App mode' })).toBeInTheDocument();
  });

  it('changes mode from the desktop mode menu and mobile settings menu', () => {
    const setMode = vi.fn();
    renderControls([], mockSetPeople, mockToggleTheme, 'normal', setMode);

    fireEvent.click(screen.getByRole('button', { name: 'App mode' }));
    fireEvent.click(screen.getByRole('button', { name: 'Round Robin' }));
    expect(setMode).toHaveBeenCalledWith('round-robin');
    expect(screen.queryByRole('group', { name: 'App mode' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    fireEvent.click(screen.getByRole('button', { name: /^Mode:/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Round Robin' }));
    expect(setMode).toHaveBeenCalledTimes(2);
  });

  it('calls onToggleTheme when the theme button is clicked', () => {
    renderControls();

    fireEvent.click(screen.getByTitle('Toggle theme'));
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('calls shareUrl with list of people names when share button is clicked', () => {
    const people: Person[] = [
      { id: 1, name: 'Alice', enabled: true },
      { id: 2, name: 'Bob', enabled: false },
    ];

    renderControls(people);

    fireEvent.click(screen.getByTitle('Share'));
    expect(shareUrl).toHaveBeenCalledTimes(1);
    expect(shareUrl).toHaveBeenCalledWith(['Alice', 'Bob']);
  });

  it('adds a single name when form is submitted', () => {
    const initialPeople: Person[] = [{ id: 10, name: 'Existing', enabled: true }];
    renderControls(initialPeople);

    const input = screen.getByPlaceholderText('Enter a name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New Person' } });
    expect(input.value).toBe('New Person');

    fireEvent.submit(screen.getByRole('button', { name: 'Add' }));

    expect(mockSetPeople).toHaveBeenCalledTimes(1);
    expect(mockSetPeople).toHaveBeenCalledWith([
      ...initialPeople,
      { id: 0, name: 'New Person', enabled: true },
    ]);
    expect(input.value).toBe('');
  });

  it('does not add empty or whitespace-only name', () => {
    renderControls();

    const input = screen.getByPlaceholderText('Enter a name');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Add' }));

    expect(mockSetPeople).not.toHaveBeenCalled();
  });

  it('toggles import mode and switches between input and textarea', () => {
    renderControls();

    const importButton = screen.getByTitle('Import');
    fireEvent.click(importButton);

    expect(screen.getByPlaceholderText('Enter names, one per line')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter a name')).not.toBeInTheDocument();

    fireEvent.click(importButton);

    expect(screen.getByPlaceholderText('Enter a name')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter names, one per line')).not.toBeInTheDocument();
  });

  it('imports multiple names and resets mode on submission', () => {
    renderControls([{ id: 1, name: 'Old', enabled: true }]);

    fireEvent.click(screen.getByTitle('Import'));

    const textarea = screen.getByPlaceholderText('Enter names, one per line');
    fireEvent.change(textarea, {
      target: { value: 'Alice\nBob\n  Charlie  \n\n' },
    });

    fireEvent.submit(screen.getByRole('button', { name: 'Add' }));

    expect(mockSetPeople).toHaveBeenCalledTimes(1);
    expect(mockSetPeople).toHaveBeenCalledWith([
      { id: 0, name: 'Alice', enabled: true },
      { id: 1, name: 'Bob', enabled: true },
      { id: 2, name: 'Charlie', enabled: true },
    ]);

    // Should switch back to single name mode
    expect(screen.getByPlaceholderText('Enter a name')).toBeInTheDocument();
  });

  it('does not import when textarea is empty or whitespace only', () => {
    renderControls();

    fireEvent.click(screen.getByTitle('Import'));

    const textarea = screen.getByPlaceholderText('Enter names, one per line');
    fireEvent.change(textarea, { target: { value: '\n   \n' } });

    fireEvent.submit(screen.getByRole('button', { name: 'Add' }));

    expect(mockSetPeople).not.toHaveBeenCalled();
    // Remains in import mode
    expect(screen.getByPlaceholderText('Enter names, one per line')).toBeInTheDocument();
  });

  it('renders NameList when not in import mode, and hides it in import mode', () => {
    const people: Person[] = [{ id: 1, name: 'Alice', enabled: true }];
    renderControls(people);

    expect(screen.getByText('Alice')).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Import'));
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });
});
