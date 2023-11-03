export namespace Components {
  export namespace Props {
    export interface Modal {
      transitionState: 0 | 1 | 2 | 3 | 4;
      onClose(): Promise<void>;
    }

    export interface Interactable {
      onContextMenu?: (event: React.MouseEvent) => void;
      onClick?: (event: React.MouseEvent) => void;
    }

    export interface InteractableWithState<T> extends Interactable {
      state: T;
    }
  }
}
