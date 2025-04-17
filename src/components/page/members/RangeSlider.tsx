interface RangeSliderProps {
  id: string;
  name: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  unit?: string;
  rangeText?: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: number) => void;
}

export default function RangeSlider({
  id,
  name,
  label,
  min,
  max,
  step = 1,
  value,
  unit = '',
  rangeText,
  onChange,
}: RangeSliderProps) {
  return (
    <div>
      <div className="flex justify-between">
        <label htmlFor={id}>{label}</label>
        {rangeText && <p className="text-gray-400">{rangeText}</p>}
      </div>
      <input
        id={id}
        name={name}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`
          
          w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-grab
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:w-10
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-violet-300
          [&::-webkit-slider-thumb]:hover:bg-rose-600
        `}
      />
      <p className="mt-1">
        선택한 {label} : {value} {unit}
      </p>
    </div>
  );
}
