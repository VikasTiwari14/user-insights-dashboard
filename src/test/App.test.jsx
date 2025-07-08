import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from '../App.jsx';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../utils/mockApi', () => ({
  fetchUsers: vi.fn(() =>
    Promise.resolve([
      { "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "status": "active", "lastLogin": "15:06:25 08:12" },
      { "id": 2, "name": "Bob Smith", "email": "bob@example.com", "status": "inactive", "lastLogin": "28:06:25 12:34" },
      { "id": 3, "name": "Charlie Evans", "email": "charlie@example.com", "status": "pending", "lastLogin": "01:07:25 09:00" },
      { "id": 4, "name": "Bob Evans", "email": "bobevans@example.com", "status": "active", "lastLogin": "15:07:25 09:00" },
    ])
  ),
}));

describe('App', () => {
  describe('work fine with search, sort and filter', () => {
    it('work fine with search and filter', async () => {
      render(<App />);

      const input = await screen.findByTestId('search-input');
      fireEvent.change(input, { target: { value: 'bob' } });
      const checkbox = await screen.findByTestId('status-active');
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(screen.getByText(/Alice/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Bob/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Charlie/)).not.toBeInTheDocument();
      });
    });

    it('works fine with search, filter and sort', async () => {
      render(<App />);

      const input = await screen.findByTestId('search-input');
      fireEvent.change(input, { target: { value: 'bob' } });
      const checkboxActive = await screen.findByTestId('status-active');
      fireEvent.click(checkboxActive);
      const checkboxInActive = await screen.findByTestId('status-inactive');
      fireEvent.click(checkboxInActive);

      await waitFor(() => {
        const listItems = screen.getByTestId('user-table-body').querySelectorAll('tr');
        expect(listItems.length).toBe(2);
        expect(listItems[0].textContent).toContain('Bob Smith');
        expect(listItems[1].textContent).toContain('Bob Evans');
      });
    });
  });

  it('sorts users when toggle is clicked', async () => {
    render(<App />);
    const button = await screen.findByText(/Last Login/i);
    fireEvent.click(button);

    await waitFor(() => {
      const listItems = screen.getByTestId('user-table-body').querySelectorAll('tr');
      expect(listItems[0].textContent).toContain('Charlie');
      expect(listItems[1].textContent).toContain('Alice');
      expect(listItems[2].textContent).toContain('Bob Evans');
      expect(listItems[2].textContent).toContain('Bob Smith');
    });
  });
});
