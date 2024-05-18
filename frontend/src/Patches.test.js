import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Patches from './Patches';

// Mocking react-router-dom Link to avoid errors related to router context missing in test environment
jest.mock('react-router-dom', () => ({
  Link: ({ children }) => <div>{children}</div>
}));

beforeEach(() => {
    global.fetch = jest.fn();
  });

// Setup fetch mock
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ images: ['image1base64', 'image2base64'], text: ['Text1', 'Text2'] }),
  })
);

describe(Patches, () => {
  beforeEach(() => {
    fetch.mockClear();
  });
test('handles fetch failure', async () => {
  // Cause the fetch to fail
  fetch.mockImplementationOnce(() => Promise.reject(new Error('Network failure')));

  const { getByText } = render(<Patches />);
  fireEvent.click(getByText('Show Images'));

  // Wait for error message to be displayed
  await waitFor(() => {
    expect(screen.getByText('Network failure')).toBeInTheDocument();
  });
});


  test('initially shows description and a button to fetch images', () => {
    const { getByText } = render(<Patches />);
    expect(getByText('Understanding Patches in Vision Transformers')).toBeInTheDocument();
    expect(getByText('Show Images')).toBeInTheDocument();
  });

  test('fetches images on button click and updates UI', async () => {
    const { getByText, findAllByRole } = render(<Patches />);
    fireEvent.click(getByText('Show Images'));

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/patches');

    // Wait for images to be displayed
    await waitFor(() => {
      expect(screen.getByText('Hide Images')).toBeInTheDocument();
    });

    // Verify images are rendered
    const images = await findAllByRole('img');
    expect(images.length).toBe(2);
    expect(images[0]).toHaveAttribute('src', 'data:image/png;base64,image1base64');
    expect(images[1]).toHaveAttribute('src', 'data:image/png;base64,image2base64');
  });

  test('handles fetch failure', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network failure'))
    );
  
    const { getByText } = render(<Patches />);
    fireEvent.click(getByText('Show Images'));
  
    await waitFor(() => {
      expect(screen.getByText('There was a problem with the fetch operation: Network failure')).toBeInTheDocument();
    });
  });
});
