import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom';

// Allow router mocks.
// eslint-disable-next-line no-undef, global-require
jest.mock('next/router', () => require('next-router-mock'))