import { render, screen } from '@testing-library/react';
import App from './App';
import { MOCK_REVIEW_RESULT, mockApplyReviewedCode } from './mockData';

test('renders repo input component', () => {
  render(<App />);
  expect(screen.getByText(/Start a Review/i)).toBeInTheDocument();
});

test('top nav appears', () => {
  render(<App />);
  expect(screen.getByTestId('topnav')).toBeInTheDocument();
});
