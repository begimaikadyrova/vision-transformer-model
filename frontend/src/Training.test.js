import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Training from './Training';  // Adjust the path according to your file structure
import { BrowserRouter as Router } from 'react-router-dom';

// Mock fetch to control the fetch behavior
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

    // Ensure fetch is called
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/graph');

    // Wait for the dropdown to be populated
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

    // Wait for the select dropdown to be interactable
    const selectInput = screen.getByRole('combobox');
    fireEvent.mouseDown(selectInput);

    // Use a flexible text matcher to account for potential multiple elements or text split across elements
    const option = await screen.findByText((content, element) =>
      element.textContent === 'multi_head_attention_attention_output'
    );

    fireEvent.click(option);

    // Verify the state update after selection
    await waitFor(() => {
      expect(screen.getByText('Explore how the model learns over time and adjusts its parameters accordingly')).toBeInTheDocument();
    });

    // Interact with the play button
    const playButton = screen.getByTitle('Click on the play button to see the model\'s weights change over time');
    fireEvent.click(playButton);

    // Check if the media controls are interacting correctly
    await waitFor(() => {
      expect(playButton).toBeDisabled(); // The button should be disabled after playing
    });
  });
});
