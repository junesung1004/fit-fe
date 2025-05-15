interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

export default function Spinner({
  size = 'md',
  color = 'primary',
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const borderClasses = {
    sm: 'border-2',
    md: 'border-4',
    lg: 'border-4',
  };

  const colorClasses = {
    primary: 'border-rose-500 border-t-transparent',
    secondary: 'border-gray-400 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} ${borderClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
      />
    </div>
  );
}
