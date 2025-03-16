'use client';

import { QuestionsApi } from '@/api';
import { Question, UiState } from '@/types';
import { useEffect, useState } from 'react';
import styles from './Questions.module.css';

type Props = {
    id: number
  };

export default function Questions({ id }: Props) {
  const [uiState, setUiState] = useState<UiState>('initial');
  const [questions, setQuestions] = useState<Array<Question> | null>(
    null,
  );

  useEffect(() => {
    async function fetchData() {
      setUiState('loading');

      const api = new QuestionsApi();
      const questionsResponse = await api.getQuestionsForCategory(id);

      if (!questionsResponse) {
        setUiState('error');
      } else {
        setUiState('data');
        setQuestions(questionsResponse);
      }
    }
    fetchData();
  }, []);


  return (
    <div className={styles.questions}>
        {uiState === 'loading' && <p>Sæki spurningar</p>}
        {uiState === 'error' && <p>Villa við að sækja spurningar</p>}
        {uiState === 'data' && (
            questions?.map((question, qid) => (
                <fieldset key={qid}>
                    <legend>{question.text}</legend>
                    {question.answers.map((answer, aid) => (
                        <label className={answer.correct ? 'correct' : 'false'} key={aid}>
                            <input type='radio' name={question.text} value={answer.text}/>
                            {answer.text}
                        </label>
                    ))}
                    <div className={styles.bottom}>
                        <button type='button'>Athuga svar?</button>
                        <p className='answer-box'></p>
                    </div>
                </fieldset>
            ))
        )}
    </div>
  );
}