import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
// @ts-ignore
import MutationObserver from '@sheerun/mutationobserver-shim';
// @ts-ignore
import { toBeInTheDocument } from '@testing-library/jest-dom/matchers';

import useContextMenu from '../src';

expect.extend({ toBeInTheDocument });
window.MutationObserver = MutationObserver;

const TestWithOneTarget = () => {
  const menu = React.useRef<HTMLElement | null>(null);
  const target = React.useRef<HTMLElement | null>(null);
  const state = useContextMenu({
    menu,
    targets: [{ id: 'target', target }],
  });

  return (
    <>
      <span ref={target}>target</span>
      {state.target.isOpen && (
        <ul>
          <li>target context menu here</li>
        </ul>
      )}
    </>
  );
};

const TestWithTwoTargets = () => {
  const menu = React.useRef<HTMLElement | null>(null);
  const targetOne = React.useRef<HTMLElement | null>(null);
  const targetTwo = React.useRef<HTMLElement | null>(null);
  const state = useContextMenu({
    menu,
    targets: [
      { id: 'targetOne', target: targetOne },
      { id: 'targetTwo', target: targetTwo },
    ],
  });

  return (
    <>
      <span ref={targetOne}>target one</span>
      <span ref={targetTwo}>target two</span>
      {state.targetOne.isOpen && (
        <ul>
          <li>target one context menu here</li>
        </ul>
      )}
      {state.targetTwo.isOpen && (
        <ul>
          <li>target two context menu here</li>
        </ul>
      )}
    </>
  );
};

describe('useContextMenu', () => {
  it('import useContextMenu from "index"', () => {
    expect(typeof useContextMenu).toBe('function');
  });
  describe('initial state', () => {
    test('only menu passed', () => {
      const menu = React.createRef<HTMLElement>();

      const { result } = renderHook(() => useContextMenu({ menu }));

      expect(result.current.document.id).toBe('document');
      expect(result.current.document.isOpen).toBe(false);
    });
    test('menu + 1 target passed', () => {
      const menu = React.createRef<HTMLElement>();
      const target = React.createRef<HTMLElement>();

      const { result } = renderHook(() =>
        useContextMenu({ menu, targets: [{ id: 'clientTarget', target }] })
      );

      expect(result.current.clientTarget.id).toBe('clientTarget');
      expect(result.current.clientTarget.target).toBe(target);
      expect(result.current.clientTarget.isOpen).toBe(false);
    });
    test('menu + 2 target passed', () => {
      const menu = React.createRef<HTMLElement>();
      const clientTarget = React.createRef<HTMLElement>();
      const blogTarget = React.createRef<HTMLElement>();

      const targets = [
        { id: 'clientTarget', target: clientTarget },
        { id: 'blogTarget', target: blogTarget },
      ];
      const { result } = renderHook(() => useContextMenu({ menu, targets }));

      expect(result.current.clientTarget.id).toBe('clientTarget');
      expect(result.current.clientTarget.target).toBe(clientTarget);
      expect(result.current.clientTarget.isOpen).toBe(false);

      expect(result.current.blogTarget.id).toBe('blogTarget');
      expect(result.current.blogTarget.target).toBe(blogTarget);
      expect(result.current.blogTarget.isOpen).toBe(false);
    });
  });
  describe('state management', () => {
    describe('only menu passed', () => {
      test('right click anywhere in document should flip isOpen bool', () => {
        const menu = React.createRef<HTMLElement>();

        const { result } = renderHook(() => useContextMenu({ menu }));

        expect(result.current.document.id).toBe('document');
        expect(result.current.document.isOpen).toBe(false);

        act(() => {
          fireEvent.contextMenu(document);
        });

        expect(result.current.document.isOpen).toBe(true);
      });
    });
    describe('menu plus 1 target', () => {
      test('right click on target should fip isOpen', async () => {
        const { findByText, getByText } = render(<TestWithOneTarget />);

        const targetEl = getByText(/target/);

        fireEvent.contextMenu(targetEl);

        expect(
          await findByText(/target context menu here/)
        ).toBeInTheDocument();
      });
    });
    describe('menu plus 2 targets', () => {
      test('right click on targets should fip appropriate isOpen', async () => {
        const { findByText, getByText } = render(<TestWithTwoTargets />);

        const targetOneEl = getByText(/target one/);
        const targetTwoEl = getByText(/target two/);

        fireEvent.contextMenu(targetOneEl);

        expect(
          await findByText(/target one context menu here/)
        ).toBeInTheDocument();

        fireEvent.contextMenu(targetTwoEl);

        expect(
          await findByText(/target two context menu here/)
        ).toBeInTheDocument();
      });
    });
  });
});
