import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Result, { allocationStatus } from './Result';
jest.mock('html2canvas', () => jest.fn());
jest.mock('jspdf', () => jest.fn());

test('does not invent a prediction when state is missing', () => {
  render(<MemoryRouter><Result /></MemoryRouter>);
  expect(screen.getByText('No valid prediction available')).toBeInTheDocument();
  expect(screen.queryByText('6.50 L')).not.toBeInTheDocument();
});
test('allocation within range stays uncertain', () => {
  expect(allocationStatus({ lower_litres: 21, upper_litres: 40 }, 30)).toMatch(/Uncertain/);
  expect(allocationStatus({ lower_litres: 21, upper_litres: 40 }, 40)).toBe('Covers estimated range');
  expect(allocationStatus({ lower_litres: 21, upper_litres: 40 }, 20)).toBe('Below estimated requirement');
});
test('open upper category never guarantees sufficient fuel', () => {
  expect(allocationStatus({ lower_litres: 100, upper_litres: null }, 150)).toMatch(/Uncertain/);
  expect(allocationStatus({ lower_litres: 100, upper_litres: null }, 100)).toBe('Below estimated requirement');
});
