import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';
import useContextMenu from '../src';

const TARGET_ONE_ITEMS = [
  { label: 'Charge an invoice', value: 'some value' },
  { label: 'Search', value: 'some search' },
];

const TARGET_TWO_ITEMS = [
  { label: 'New Message', value: 'some new message value' },
  { label: 'Mark Pending', value: 'mark pending' },
];

type Item = { label: string; value: string };
type PropsType = {
  items: Item[];
  ref: React.Ref<HTMLUListElement>;
};

const ContextMenu: React.FC<PropsType> = React.forwardRef(
  ({ items }, ref: React.Ref<HTMLUListElement>) => (
    <ul ref={ref} className="menu">
      {items.map(({ label, value }) => (
        <li key={value} onClick={() => alert(`${label}: ${value}`)}>
          {label}
        </li>
      ))}
    </ul>
  )
);

const TestWithTwoTargets = () => {
  const menu = React.useRef<HTMLUListElement | null>(null);
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
        <ContextMenu items={TARGET_ONE_ITEMS} ref={menu} />
      )}
      {state.targetTwo.isOpen && (
        <ContextMenu items={TARGET_TWO_ITEMS} ref={menu} />
      )}
    </>
  );
};
const App = () => {
  return (
    <div>
      <TestWithTwoTargets />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
