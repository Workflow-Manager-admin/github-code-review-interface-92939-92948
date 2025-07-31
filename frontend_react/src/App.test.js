import { render, screen } from '@testing-library/react';
import App from './App';

test('renders repo input component', () => {
  render(<App />);
  expect(screen.getByText(/Start a Review/i)).toBeInTheDocument();
});

test('top nav appears', () => {
  render(<App />);
  expect(screen.getByTestId('topnav')).toBeInTheDocument();
});
