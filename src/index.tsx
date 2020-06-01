import * as React from 'react';

type Target = { id: string; target: React.RefObject<HTMLElement | Document> };
type State = {
  [id: string]: {
    id: string;
    isOpen: boolean;
    target: Target['target'];
  };
};
interface PropsType {
  menu: React.RefObject<HTMLElement>;
  targets?: Target[];
}

function useContextMenu({ menu, targets = [] }: PropsType) {
  const targetElements = React.useRef<Target[] | null>(null);
  const [state, setState] = React.useState<State>(() => {
    if (!targets.length) {
      return {
        document: {
          id: 'document',
          target: { current: document },
          isOpen: false,
        },
      };
    }
    return targets.reduce(
      (obj, { id, target }) => ({
        ...obj,
        [id]: {
          id,
          isOpen: false,
          target,
        },
      }),
      {}
    );
  });
  React.useEffect(() => {
    // if no target is passed set targetElements to document
    // we assume they want it to show up anywhere right click happens
    if (!targets.length) {
      targetElements.current = [
        { id: 'document', target: { current: document } },
      ];
    } else {
      targetElements.current = targets;
    }
  }, [targets]);

  React.useLayoutEffect(() => {
    const anyMenuOpen = Object.values(state).some(({ isOpen }) => isOpen);
    const target = Object.values(state).find(({ isOpen }) => isOpen);

    const isClickOutside = (e: MouseEvent) => {
      if (target && menu?.current && menu.current.contains(e.target as Node)) {
        setTimeout(
          () =>
            setState(prev => ({
              ...prev,
              [target.id]: {
                ...target,
                isOpen: false,
              },
            })),
          200
        );
        return;
      }
      if (target && anyMenuOpen && !menu?.current?.contains(e.target as Node)) {
        setState(prev => ({
          ...prev,
          [target.id]: {
            ...target,
            isOpen: false,
          },
        }));
        return;
      }
    };
    const handleContextClick = (e: MouseEvent) => {
      const contextContainerClicked = targetElements?.current?.find(el =>
        el?.target?.current?.contains(e.target as Node)
      );
      if (anyMenuOpen) {
        e.preventDefault();
        const openContext = Object.values(state).find(({ isOpen }) => isOpen);

        if (openContext && contextContainerClicked) {
          setState(prev => ({
            ...prev,
            [openContext.id]: {
              ...openContext,
              isOpen: false,
            },
            [contextContainerClicked.id]: {
              ...contextContainerClicked,
              isOpen: true,
            },
          }));
          return;
        }
      }
      if (!anyMenuOpen && contextContainerClicked) {
        e.preventDefault();
        setState(prev => ({
          ...prev,
          [contextContainerClicked.id]: {
            ...contextContainerClicked,
            isOpen: true,
          },
        }));

        if (!menu.current) return;

        menu.current.style.top = `${e.clientY}px`;
        menu.current.style.left = `${e.clientX}px`;
      }
    };
    window.addEventListener('contextmenu', handleContextClick);
    // no sense is having mousedown listener if menu is not open
    if (anyMenuOpen) {
      window.addEventListener('mousedown', isClickOutside);
    }
    return () => {
      window.removeEventListener('contextmenu', handleContextClick);
      window.removeEventListener('mousedown', isClickOutside);
    };
  }, [menu, targets, state]);

  return state;
}

export default useContextMenu;
