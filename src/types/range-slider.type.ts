// eslint-disable-next-line no-unused-vars
type RangeSliderOnInput = (min: number, max: number) => void;

export interface RangeSliderProps {
  id: string;
  name: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  minValue: number;
  maxValue: number;
  unit?: string;
  rangeText?: string;
  onInput: RangeSliderOnInput;
}
