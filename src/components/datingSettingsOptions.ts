import { DatingOptionType } from '@/types/datingOptions.type';

const DATING_OPTION: DatingOptionType[] = [
  {
    id: 'age',
    label: '나이',
    options: [
      { value: '', label: '선택하세요' },
      { value: '20-25', label: '20세 ~ 25세' },
      { value: '25-30', label: '25세 ~ 30세' },
      { value: '30-35', label: '30세 ~ 35세' },
      { value: '35-40', label: '35세 ~ 40세' },
      { value: '40-45', label: '40세 ~ 45세' },
      { value: '45-50', label: '45세 ~ 50세' },
    ],
  },
  {
    id: 'height',
    label: '키',
    options: [
      { value: '', label: '선택하세요' },
      { value: '150-155', label: '150cm ~ 155cm' },
      { value: '155-160', label: '155cm ~ 160cm' },
      { value: '160-165', label: '160cm ~ 165cm' },
      { value: '165-170', label: '165cm ~ 170cm' },
      { value: '170-175', label: '170cm ~ 175cm' },
      { value: '175-180', label: '175cm ~ 180cm' },
      { value: '180-185', label: '180cm ~ 185cm' },
      { value: '185-190', label: '185cm ~ 190cm' },
      { value: '190-195', label: '190cm ~ 195cm' },
    ],
  },
  {
    id: 'region',
    label: '지역',
    options: [
      { value: '', label: '선택하세요' },
      { value: '서울', label: '서울' },
      { value: '부산', label: '부산' },
      { value: '대구', label: '대구' },
      { value: '인천', label: '인천' },
      { value: '광주', label: '광주' },
      { value: '대전', label: '대전' },
      { value: '울산', label: '울산' },
      { value: '세종', label: '세종' },
      { value: '경기', label: '경기도' },
      { value: '강원', label: '강원도' },
      { value: '충북', label: '충청북도' },
      { value: '충남', label: '충청남도' },
      { value: '전북', label: '전라북도' },
      { value: '전남', label: '전라남도' },
      { value: '경북', label: '경상북도' },
      { value: '경남', label: '경상남도' },
      { value: '제주', label: '제주도' },
    ],
  },
];

export default DATING_OPTION;
