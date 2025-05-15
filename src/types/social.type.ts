import {
  FieldError,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormRegisterReturn,
} from 'react-hook-form';

export interface SocialGenderSelectorProps {
  register: UseFormRegisterReturn;
  required?: boolean;
  selectedGender?: string;
  error?: string;
}

export interface SocialInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  isDirty?: boolean;
  register?: UseFormRegisterReturn;
}

export interface SocialMbtiSelectorProps {
  register: UseFormRegister<SocialSignUpFormValues>;
  error?: string;
  required?: boolean;
}

export interface SocialSignUpFormValues {
  nickname: string;
  name: string;
  job: string;
  height: number;
  gender: string;
  birthday: string;
  region: string;
  phone?: string;
  mbti: string;
  interests: string[];
  listening: string[];
  selfintro: string[];
  images: string[];
}

export interface SocialSignUpPayload {
  name: string;
  height: number;
  nickname: string;
  birthday: string;
  gender: string;
  phone?: string;
  region: string;
  job: string;
  mbti: string;
  selfintro: string[];
  listening: string[];
  interests: string[];
  images: string[];
}

export interface SocialSignUpErrorResponse {
  message: string;
  errorCode?: string;
  errors?: {
    [key: string]: string;
  };
}

export interface SocialMultiToggleButtonGroupProps {
  label: string;
  name: keyof SocialSignUpFormValues;
  options: string[];
  required?: boolean;
  limit?: number;
  min?: number;
  register: UseFormRegister<SocialSignUpFormValues>;
  setValue: UseFormSetValue<SocialSignUpFormValues>;
  trigger: UseFormTrigger<SocialSignUpFormValues>;
  error?: FieldError;
  gridCols?: string;
  isLoading?: boolean;
}

export interface SocialRegionSelectorProps {
  register: UseFormRegister<SocialSignUpFormValues>;
  error?: string;
  required?: boolean;
}
