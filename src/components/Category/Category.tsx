'use client';

import { QuestionsApi } from '@/api';
import { Category as CategoryType } from '@/types';
import { useEffect, useState } from 'react';
import NotFound from '../Errors/NotFound';
import Questions from '../Questions/Questions';


export function Category({ slug }: { slug: string }) {
  const [category, setCategory] = useState<CategoryType | null>(null);

  useEffect(() => {
    async function fetchData() {
      const api = new QuestionsApi();
      const response = await api.getCategory(slug);
      setCategory(response);
    }
    fetchData();
  }, [slug]);

  if (!category) {
    return <NotFound/>;
  }

  return (
    <div>
      <h1>{category.title}</h1>
      <p>Reyndu við spurningarnar!</p>
      <Questions id={Number(category.id)}/>
    </div>
  )
}
