import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as any;

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});
