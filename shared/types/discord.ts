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
