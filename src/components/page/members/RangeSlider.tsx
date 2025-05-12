import { RangeSliderProps } from '@/types/rangeSlider.type';

const SLIDER_THUMB_STYLES = `
  [&::-webkit-slider-thumb]:appearance-none
  [&::-webkit-slider-thumb]:h-4
  [&::-webkit-slider-thumb]:w-4
  [&::-webkit-slider-thumb]:rounded-full
  [&::-webkit-slider-thumb]:bg-violet-500
  [&::-webkit-slider-thumb]:border-2
  [&::-webkit-slider-thumb]:border-violet-300
  [&::-webkit-slider-thumb]:pointer-events-auto
  [&::-webkit-slider-thumb]:cursor-grab
`;

export default function RangeSlider({
  id,
  name,
  label,
  min,
  max,
  step = 1,
  minValue,
  maxValue,
  unit = '',
  rangeText,
  onInput,
}: RangeSliderProps) {
  const getPercent = (value: number) => ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex justify-between">
        <label htmlFor={id}>{label}</label>
        {rangeText && <p className="text-gray-400">{rangeText}</p>}
      </div>
      <div className="relative h-8">
        <div className="absolute w-full h-2 top-3 bg-gray-100 rounded-lg" />
        <div
          className="absolute h-2 top-3 bg-violet-300 rounded-lg"
          style={{
            left: `${getPercent(minValue)}%`,
            width: `${getPercent(maxValue) - getPercent(minValue)}%`,
          }}
        />
        <input
          id={`${id}-min`}
          name={`${name}-min`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onInput={(e) => {
            const newMin = Number(e.currentTarget.value);
            if (newMin <= maxValue) {
              onInput(newMin, maxValue);
            }
          }}
          className={`
            absolute w-full h-2 top-3 appearance-none bg-transparent pointer-events-none
            ${SLIDER_THUMB_STYLES}
          `}
        />
        <input
          id={`${id}-max`}
          name={`${name}-max`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onInput={(e) => {
            const newMax = Number(e.currentTarget.value);
            if (newMax >= minValue) {
              onInput(minValue, newMax);
            }
          }}
          className={`
            absolute w-full h-2 top-3 appearance-none bg-transparent pointer-events-none
            ${SLIDER_THUMB_STYLES}
          `}
        />
      </div>
      <p className="mt-1">
        선택한 {label} : {minValue} ~ {maxValue} {unit}
      </p>
    </div>
  );
}
