import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import HomePage from './HomePage';

describe('HomePage Component', () => {
  test('renders without crashing', () => {
    render(
      <Router>
        <HomePage />
      </Router>
    );
    expect(screen.getByText('Explore Vision Transformer')).toBeInTheDocument();
    expect(screen.getByText('About ViT Visualizer')).toBeInTheDocument();

    const nav = screen.getByRole('navigation');
    const navUtils = within(nav);
    expect(navUtils.getByText('Patches')).toBeInTheDocument();
    expect(navUtils.getByText('Training')).toBeInTheDocument();
    expect(navUtils.getByText('Graph')).toBeInTheDocument();
    expect(navUtils.getByText('Process')).toBeInTheDocument();
    expect(screen.getByText('About Tool')).toBeInTheDocument();
  });
});
