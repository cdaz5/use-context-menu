# use-context-menu

Check out the [demo](https://codesandbox.io/s/modern-https-pu2qe?file=/src/app.js).

A custom [React Hook](https://reactjs.org/docs/hooks-overview.html) that allows you to place custom context menu(s) (right click menu) throughout your codebase.

`use-context-menu` accepts two arguments, `menu` (req) and `targets` (optional),
and will return a state object representing which menu `isOpen`. See [DEMO](https://codesandbox.io/s/modern-https-pu2qe?file=/src/app.js) for examples).

## Features

⏳ Saves you time by handling all the annoying event listeners for you.

⭐️ Flexibility to make your own custom menus, we don't force a style on you!

🐑 Accepts multiple targets, giving you the ability to have multiple custom context menus per target on the same page!

## Requirement

To use `use-context-menu`, you must use `react@16.8.0` or greater which includes Hooks.

## Installation

```sh
$ yarn add use-context-menu
// or
$ npm i use-context-menu
```

## Example

**_NOTE:_** if no `targets` are passed the returned state key is automatically keyed as `document` and it is assumed that a right-click anywhere in the document should trigger the custom menu (see [DEMO](https://codesandbox.io/s/modern-https-pu2qe?file=/src/app.js) for additional examples/use cases).

```js
import { useRef } from 'react';
import useContextMenu from 'use-context-menu';

const SomeComponent = () => {
  const menu = useRef(null);
  const menuState = useContextMenu({ menu });

  return {
    <>
      {menuState.document.isOpen && (
        <ul ref={menu}>
          <li onClick={doSomething}>Im a custom context menu element!<li>
          <li onClick={doSomething}>Style me however you like!<li>
          <li onClick={doSomething}>See demo for additional examples/ideas<li>
        </ul>
      )}
    </>
  };
};

export default SomeComponent;
```

**Example with Multiple Targets:**

```js
import { useRef } from 'react';
import useContextMenu from 'use-context-menu';

const SomeComponent = () => {
  const menu = useRef(null);
  const targetOne = useRef(null);
  const targetTwo = useRef(null);

  const menuState = useContextMenu({
    menu,
    targets: [
      { id: 'targetOne', target: targetOne },
      { id: 'targetTwo', target: targetTwo },
    ]
  });

  return {
    <>
      <span ref={targetOne}>
        target one (right click me for target one menu).
      </span>
      {menuState.targetOne.isOpen && (
        <ul ref={menu}>
          <li onClick={doSomething}>Im targetOnes custom menu<li>
        </ul>
      )}
      <span ref={targetTwo}>
        target two (right click me for target two menu).
      </span>
      {menuState.targetTwo.isOpen && (
        <ul ref={menu}>
          <li onClick={doSomething}>Im targetTwos custom menu.<li>
        </ul>
      )}
    </>
  };
};

export default SomeComponent;
```

## FULL API

#### `useContextMenu({ menu, targets }): MenuState`

### `MenuState = { [targetId: string]: { isOpen: boolean } }`

- `useContextMenu` returns a `MenuState` object that consists of keys based on the `id` you supply for each `target` object in the `targets` array. Thus, if you pass to `targets` argument an array like this: `[{ id: 'customId', target: someRef }]` it will return an object like this: `{ customId: { isOpen: boolean } }`.
- **Note**: if no targets are passed the key defaults to `document` and should be used like this: `menuState.document.isOpen`.

### `menu: RefObject`

- a `ref` to the menu element. This can be reused for multiple menus on same page. No need to create multiple menu `refs`! See [demo](https://codesandbox.io/s/modern-https-pu2qe?file=/src/app.js) for examples on multiple menus.

### `targets?: Target[]`

- optional array of targets, with a unique `id` for each.
- `Target = { id: string, target: RefObject };`

## License

**[MIT](LICENSE)** Licensed

## Contributors

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
