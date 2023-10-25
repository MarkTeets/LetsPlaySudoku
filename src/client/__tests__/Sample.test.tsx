/**
 * @jest-environment jsdom
 */
import React from 'react';
// eslint-disable-next-line import/no-unresolved
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Sample from '../Sample';

it('Renders sample element', () => {
  render(<Sample />);
  const sampleElement = screen.getByText(/Sample div element/);
  expect(sampleElement).toBeInTheDocument();
  // screen.debug();
});
