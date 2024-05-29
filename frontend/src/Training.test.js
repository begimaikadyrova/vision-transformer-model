import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Training from './Training'; 
import { BrowserRouter as Router } from 'react-router-dom';


global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      layer_weights: {
        multi_head_attention: ['attention_output', 'key', 'query', 'value']
      }
    })
  })
);

beforeEach(() => {
  fetch.mockClear();
  fetch.mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        layer_weights: {
          multi_head_attention: ['attention_output', 'key', 'query', 'value']
        }
      })
    })
  );
});
  
afterEach(() => {
  jest.restoreAllMocks();
});

describe('Training Component', () => {
  test('renders without crashing and loads initial data', async () => {
    render(
      <Router>
        <Training />
      </Router>
    );

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/graph');

    await waitFor(() => {
      expect(screen.getByText('Please, select a layer')).toBeInTheDocument();
    });
  });

  test('interactions with select and button controls', async () => {
    render(
      <Router>
        <Training />
      </Router>
    );

    const selectInput = screen.getByRole('combobox');
    fireEvent.mouseDown(selectInput);

    const option = await screen.findByText((content, element) =>
      element.textContent === 'multi_head_attention_attention_output'
    );

    fireEvent.click(option);

    await waitFor(() => {
      expect(screen.getByText('Explore how the model learns over time and adjusts its parameters accordingly')).toBeInTheDocument();
    });

    const playButton = screen.getByTitle('Click on the play button to see the model\'s weights change over time');
    fireEvent.click(playButton);

    await waitFor(() => {
      expect(playButton).toBeDisabled(); 
    });
  });
});
