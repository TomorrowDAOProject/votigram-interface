export interface IToggleSlider {
  current?: number;
  items: string[];
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  onChange?: (index: number) => void;
}
