'use client';

import Button from '@/components/common/Button';
import DATING_OPTION from '@/components/datingSettingsOptions';
import { FormField, FormValueType } from '@/types/datingOptions.type';
import React, { ChangeEvent, FormEvent, useState } from 'react';

export default function DatingSettingsPage() {
  const [formValues, setFormValues] = useState<FormValueType>({
    age: '',
    height: '',
    region: '',
  });

  const handlePartnerSettingsSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('클릭');
  };

  const handlePartnerSettingsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full min-h-full flex flex-col gap-10 px-16  py-10">
      <div>
        {/* 소개받을 이성 문구 */}
        <div className="mb-5">
          <h1 className="text-5xl">소개받을 이성</h1>
          <span className="text-xs text-slate-400">
            소개받고 싶은 이성의 정보를 입력해주세요.
          </span>
        </div>

        {/* 소개받을 이성 설정 */}
        <div>
          <form
            className="flex flex-col gap-5"
            onSubmit={handlePartnerSettingsSubmit}
          >
            {DATING_OPTION.map((el) => (
              <div key={el.id} className="flex flex-col">
                <label htmlFor={el.id} className="cursor-pointer">
                  {el.label}
                </label>
                <select
                  id={el.id}
                  name={el.id}
                  value={formValues[el.id as FormField]}
                  className="cursor-pointer border border-gray-300 rounded-3xl px-5 py-6 mt-2 mb-4 appearance-none hover:shadow-lg "
                  onChange={handlePartnerSettingsChange}
                >
                  {el.options.map((option) => (
                    <option key={option.label} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <Button size="full" color="violet" type="submit">
              설정 저장
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
