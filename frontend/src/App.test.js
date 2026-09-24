import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the fuel dashboard', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /Predict Fuel Usage/i })).toBeInTheDocument();
});
