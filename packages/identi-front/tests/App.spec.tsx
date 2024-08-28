import React from 'react';
import { render, screen } from '@testing-library/react';

import App from '../src/ui/App/App';

test('App component display header', () => {
  render(<App />);
  const heading = screen.getByText(/Vite React Best Practices Template/i);
  expect(heading).toBeInTheDocument();
});
