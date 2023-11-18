export interface MenuSliderControlProps {
  'aria-label': string;
  disabled: boolean;
  isFocused: boolean;
  maxValue: number;
  onChange?: (newValue: number) => void;
  onClose: () => void;
  value: number;
  ref: React.Ref<null | {
    activate: () => boolean;
    blur: () => void;
    focus: () => void;
  }>;
}

export type MenuSliderControl = React.ForwardRefRenderFunction<
  React.Ref<null | {
    activate: () => boolean;
    blur: () => void;
    focus: () => void;
  }>,
  MenuSliderControlProps
>;

export interface TabBarProps<T extends string = string> {
  'aria-label'?: string;
  children?: React.ReactNode;
  className?: string;
  look?: string;
  onItemSelect: (newItem: T) => void;
  orientation?: string;
  selectedItem: T;
  style?: React.CSSProperties;
  type?: string;
}

export interface TabBarItemProps<T extends string = string> {
  children?: React.ReactNode;
  className?: string;
  clickableRef?: React.MutableRefObject<HTMLElement>;
  color?: string;
  disabled?: boolean;
  disableItemStyles?: boolean;
  id: T;
  itemType?: string;
  look?: string;
  onContextMenu?: (event: React.MouseEvent) => void;
  selectedItem?: string;
}

export interface TabBar {
  (props: TabBarProps): React.ReactElement;
  Item: <T extends string = string>(props: TabBarItemProps<T>) => React.ReactElement;
}
