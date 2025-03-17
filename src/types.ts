export type UiState = 'initial' | 'loading' | 'error' | 'data' | 'empty';

export type Category = {
  id: string;
  slug: string;
  title: string;
};

/** 
export type Paginated<T> = {
  data: T[];
  total: number;
  limit: number;
  offset: number;
};
*/

export type Answer = {
  id: number;
  text: string;
  correct: boolean;
  q_id: number
};

export type AnswerData = {
  text: string;
  correct: boolean;
};

export type Question = {
  id: number;
  text: string;
  answers: Answer[];
  cat_id: number;
};

export type QuestionData = {
  text: string;
  answers: AnswerData[];
  cat_id: number;
};
