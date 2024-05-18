import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Graph from './Graph';

// Mocking react-router-dom Link to avoid errors related to router context missing in test environment
jest.mock('react-router-dom', () => ({
  Link: ({ children }) => <div>{children}</div>
}));

describe('Graph component', () => {
  test('renders Graph component without crashing', () => {
    render(<Graph />);
    screen.debug(); // This will print out the rendered HTML
    expect(screen.getByText('Graph')).toBeInTheDocument();
    expect(screen.getByText('Model Overview')).toBeInTheDocument();
  });

  test('displays the correct image source for the graph', () => {
    render(<Graph />);
    const imgElement = screen.getByRole('img', { name: /Graph/i });
    expect(imgElement).toHaveAttribute('src', 'http://localhost:5000/get_graph_image');
    expect(imgElement).toHaveAttribute('alt', 'Graph');
  });

  test('renders navigation links correctly', () => {
    render(<Graph />);
    expect(screen.getByText('Patches')).toBeInTheDocument();
    expect(screen.getByText('Training')).toBeInTheDocument();
    expect(screen.getByText('Graph')).toBeInTheDocument();
    expect(screen.getByText('Process')).toBeInTheDocument();
    expect(screen.getByText('About Tool')).toBeInTheDocument();
  });
});

