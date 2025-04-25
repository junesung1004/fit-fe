import instance from '@/lib/axios';

// Spark 리스트 받아오는 API
export const fetchSparkList = async () => {
  const res = await instance.get('/spark-list');
  return res.data;
};
