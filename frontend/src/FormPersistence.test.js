import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

const field = name => document.querySelector(`[name="${name}"]`);
const change = (name, value) => fireEvent.change(field(name), { target: { value } });
const originalFetch = global.fetch;

beforeEach(() => {
  sessionStorage.clear();
  window.history.replaceState({}, '', '/');
});
afterEach(() => {
  jest.restoreAllMocks();
  global.fetch = originalFetch;
});

test('keeps all inputs after visiting the guide and after remounting the app', () => {
  const values = {
    IV_Vehicle_Type: '3', IV_Fuel_Type: '2', IV_Driving_Style: '2',
    IV_Average_Speed: '3', IV_Traffic_Type: '2', IV_Fuel_Consumption_Rating: '2',
    IV_Quick_Acceleration: '1', IV_Sudden_Brakes: '1', IV_Traffic_Congestion: '3',
    IV_Stop_and_Go: '1', IV_Distance_KM: '245', weeklyAllocation: '35'
  };
  const app = render(<App />);
  Object.entries(values).forEach(([name, value]) => change(name, value));
  fireEvent.click(screen.getByRole('link', { name: /How do I fill/i }));
  fireEvent.click(screen.getByRole('button', { name: /Proceed to Dashboard/i }));
  Object.entries(values).forEach(([name, value]) => expect(field(name).value).toBe(value));
  app.unmount();
  render(<App />);
  Object.entries(values).forEach(([name, value]) => expect(field(name).value).toBe(value));
});

test('failed prediction preserves inputs and a retry sends the latest edited values', async () => {
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  global.fetch = jest.fn().mockRejectedValue(new Error('Connection failed'));
  render(<App />);
  document.querySelectorAll('select').forEach(select => change(select.name, '1'));
  change('IV_Stop_and_Go', '0');
  change('IV_Quick_Acceleration', '0');
  change('IV_Distance_KM', '120');
  change('weeklyAllocation', '30');
  change('IV_Traffic_Congestion', '3');
  fireEvent.click(screen.getByRole('button', { name: /Predict Fuel Usage/i }));
  await screen.findByRole('button', { name: /Predict Fuel Usage/i });
  expect(field('IV_Distance_KM').value).toBe('120');
  expect(field('weeklyAllocation').value).toBe('30');
  change('IV_Distance_KM', '260');
  global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({
    period: 'weekly', fuel_range: { label: '21-40 L', lower_litres: 21, upper_litres: 40 }, warnings: []
  }) });
  fireEvent.click(screen.getByRole('button', { name: /Predict Fuel Usage/i }));
  await screen.findByRole('button', { name: /Back to Dashboard/i });
  const payload = JSON.parse(global.fetch.mock.calls[1][1].body);
  expect(payload.IV_Distance_KM).toBe(260);
  expect(payload.IV_Traffic_Congestion).toBe(3);
  expect(payload.IV_Stop_and_Go).toBe(0);
  expect(payload.IV_Quick_Acceleration).toBe(0);
  expect(payload).not.toHaveProperty('weeklyAllocation');
  fireEvent.click(screen.getByRole('button', { name: /Back to Dashboard/i }));
  expect(field('IV_Distance_KM').value).toBe('260');
});

test('Clear Form restores defaults and removes the saved draft', () => {
  const app = render(<App />);
  change('IV_Distance_KM', '120');
  change('IV_Vehicle_Type', '5');
  fireEvent.click(screen.getByRole('button', { name: /Clear Form/i }));
  expect(field('IV_Distance_KM').value).toBe('');
  expect(field('IV_Vehicle_Type').value).toBe('');
  screen.getAllByRole('combobox').forEach(select => expect(select).toHaveValue(''));
  expect(sessionStorage.getItem('fuel-dashboard-draft-v2')).toBeNull();
  app.unmount();
  render(<App />);
  expect(field('IV_Distance_KM').value).toBe('');
});

test('old drafts cannot preselect answers and missing selections block prediction', () => {
  sessionStorage.setItem('fuel-dashboard-draft-v1', JSON.stringify({ IV_Vehicle_Type: '1', IV_Fuel_Type: '1' }));
  global.fetch = jest.fn();
  render(<App />);
  screen.getAllByRole('combobox').forEach(select => expect(select).toHaveValue(''));
  change('IV_Distance_KM', '120');
  change('weeklyAllocation', '30');
  fireEvent.click(screen.getByRole('button', { name: /Predict Fuel Usage/i }));
  expect(screen.getAllByRole('alert')).toHaveLength(10);
  expect(field('IV_Vehicle_Type')).toHaveFocus();
  expect(global.fetch).not.toHaveBeenCalled();
  change('IV_Vehicle_Type', '3');
  expect(screen.getAllByRole('alert')).toHaveLength(9);
  fireEvent.click(screen.getByRole('button', { name: /Clear Form/i }));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('unavailable storage does not break navigation or form editing', async () => {
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Blocked'); });
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Blocked'); });
  jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('Blocked'); });
  render(<App />);
  change('IV_Distance_KM', '180');
  fireEvent.click(screen.getByRole('link', { name: /How do I fill/i }));
  fireEvent.click(screen.getByRole('button', { name: /Proceed to Dashboard/i }));
  await waitFor(() => expect(field('IV_Distance_KM').value).toBe('180'));
});
