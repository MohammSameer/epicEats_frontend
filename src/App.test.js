import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the EpicEats application', () => {
  render(<App />);
  const linkElement = screen.getByText(/EpicEats/i);
  expect(linkElement).toBeInTheDocument();
});
