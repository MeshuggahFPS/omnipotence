import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  test('renders correctly when user is not logged in', () => {
    const onLogin = jest.fn();
    const onCreateAccount = jest.fn();

    render(<Header onLogin={onLogin} onCreateAccount={onCreateAccount} />);

    expect(screen.getByText(/Log in/)).toBeInTheDocument();
    expect(screen.getByText(/Sign up/)).toBeInTheDocument();
    expect(screen.queryByText(/Welcome/)).not.toBeInTheDocument();
  });

  test('renders correctly when user is logged in', () => {
    const user = { name: 'John Doe' };
    const onLogout = jest.fn();

    render(<Header user={user} onLogout={onLogout} />);

    expect(screen.getByText((content, element) => 
      content.startsWith('Welcome,') && content.includes('John Doe')
    )).toBeInTheDocument();
    expect(screen.getByText(/Log out/)).toBeInTheDocument();
    expect(screen.queryByText(/Log in/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sign up/)).not.toBeInTheDocument();
  });

  test('calls onLogin when Log in button is clicked', () => {
    const onLogin = jest.fn();

    render(<Header onLogin={onLogin} />);

    fireEvent.click(screen.getByText(/Log in/));

    expect(onLogin).toHaveBeenCalledTimes(1);
  });

  test('calls onLogout when Log out button is clicked', () => {
    const user = { name: 'John Doe' };
    const onLogout = jest.fn();

    render(<Header user={user} onLogout={onLogout} />);

    fireEvent.click(screen.getByText(/Log out/));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  test('calls onCreateAccount when Sign up button is clicked', () => {
    const onCreateAccount = jest.fn();

    render(<Header onCreateAccount={onCreateAccount} />);

    fireEvent.click(screen.getByText(/Sign up/));

    expect(onCreateAccount).toHaveBeenCalledTimes(1);
  });
});
