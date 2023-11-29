export interface InteractableProps {
  onContextMenu?: (event: React.MouseEvent) => void;
  onClick?: (event: React.MouseEvent) => void;
}

export interface InteractableWithStateProps<T> extends InteractableProps {
  state: T;
}
