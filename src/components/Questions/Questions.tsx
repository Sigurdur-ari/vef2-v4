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
  const [chosenAnswers, setChosenAnswers] = useState<{[qid: number]: string | null}>({})
  const [correctAnswers, setCorrectAnswers] = useState<{[qid: number]: string | null}>({})
  const [results, setResults] = useState<{[qid: number]: boolean}>({})
  const [answeredQuestions, setAnsweredQuestions] = useState<{[qid: number]: boolean}>({})

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
        questionsResponse?.forEach((question, qid) => {
          const correctAnswer = question.answers.find(a => a.correct);
          if (correctAnswer) {
            correctAnswers[qid] = correctAnswer.text;
          }
        });
    
        setCorrectAnswers(correctAnswers);
      }
    }
    fetchData();
  }, [id]);

  const handleCheck = (qid: number, event: React.MouseEvent<HTMLButtonElement>) => {
    if(chosenAnswers[qid]===correctAnswers[qid]){
      setResults({...results, [qid]: true})
    }else{
      setResults({...results, [qid]: false})
    }
    setAnsweredQuestions({...answeredQuestions, [qid]: true})
    // @ts-expect-error ts skilur ekki týpuna en virkar samt vel
    event.target.disabled = true; 
  }

  const handleAnswerChange = (qid: number, value: string) => {
    setChosenAnswers(() => ({...chosenAnswers, [qid]: value}))
  }


  //Smá messy en virkar, væri hægt að búa til fleiri componenta en það er mikið að gera. 
  return (
    <div className={styles.questions}>
        {uiState === 'loading' && <p>Sæki spurningar</p>}
        {uiState === 'error' && <p>Villa við að sækja spurningar</p>}
        {uiState === 'data' && (
            questions?.map((question, qid) => (
                <div key={qid} className={styles.questionCard}>
                    <h2 className={styles.questionText}>{question.text}</h2>
                    {question.answers.map((answer, aid) => (
                        <label className={`${styles.answer} ${answeredQuestions[qid] && (answer.correct ? styles.correct : styles.false)}`} key={aid}>
                            <input type='radio' name={`question-${qid}`} value={answer.text} onChange={(e) => handleAnswerChange(qid, e.target.value)}/>
                            {answer.text}
                        </label>
                    ))}
                    <div className={styles.bottom}>
                        <button type='submit' onClick={(e) => handleCheck(qid, e)} className={styles.checkButton}>Athuga svar?</button>
                        {answeredQuestions[qid] && (
                          <p className={styles.answerBox}>{results[qid] ? "Rétt svar!!" : "Rangt svar!"}</p>
                        )}
                    </div>
                </div>
            ))
        )}
    </div>
  );
}