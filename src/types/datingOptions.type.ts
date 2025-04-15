interface OptionType {
  value: string;
  label: string;
}

export interface DatingOptionType {
  id: string;
  label: string;
  options: OptionType[];
}

export type FormField = 'age' | 'height' | 'region';
export type FormValueType = Record<FormField, string>;
