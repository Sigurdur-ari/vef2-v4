'use client';

import { QuestionsApi } from '@/api';
import { AnswerData, Category, QuestionData, UiState } from '@/types';
import { useEffect, useState } from 'react';

export default function Form() {
  const [uiState, setUiState] = useState<UiState>('empty');
  const [questionText, setQuestionText] = useState<string>('');
  const [answers, setAnswers] = useState<Array<AnswerData>>([
        {text: '', correct: false}, 
        {text: '', correct: false}
    ]);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [category, setCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<Array<Category>>([]);

  useEffect(() => {
    async function fetchCategories() {
      setUiState('loading');

      const api = new QuestionsApi();
      const categoriesResponse = await api.getCategories();

      if (!categoriesResponse) {
        setUiState('error');
      } else {
        setUiState('data');
        setCategories(categoriesResponse);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!questionText || !category || correctAnswer === null) {
        alert('Það þarf að fylla út í alla reiti!');
        return;
    }

    const question: QuestionData = {
        text: questionText,
        cat_id: category,
        answers: answers.map((ans, idx) => ({
            text: ans.text,
            correct: idx === correctAnswer
        })),
    };

    setUiState('loading');

    const api = new QuestionsApi();
    const response = await api.createQuestion(question);

    if(typeof response === 'string'){
        alert(response)
    }
    if(!response){
        setUiState('error');
    }else {
        setUiState('data')
        setQuestionText('');
        setAnswers([{text: '', correct: false}, {text: '', correct: false}]);
        setCorrectAnswer(null);
        setCategory(null);
      }
  };


  return (
    <form onSubmit={handleSubmit}>
        {uiState === 'empty' && <p>Sækir upplýsingar</p>}
        {uiState === 'loading' && <p>býr til spurninguna</p>}
        {uiState === 'error' && <p>Villa við að bæta spurningu við!</p>}
        {uiState === 'data' && (
            <>
            <label>
                Spurning:
                <input type="text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
            </label>

            <label>
                Flokkur:
                <select value={category ?? ''} onChange={(e) => setCategory(Number(e.target.value))}>
                <option value="" disabled>Veldu flokk fyrir spurninguna</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
                </select>
            </label>

            {answers.map((answer, index) => (
                <div key={index}>
                    <input
                        type="text"
                        value={answer.text}
                        onChange={(e) => {
                            const newAnswers = [...answers];
                            newAnswers[index].text = e.target.value;
                            setAnswers(newAnswers);
                        }}
                    />
                    <input
                        type="radio"
                        checked={correctAnswer === index}
                        onChange={() => setCorrectAnswer(index)}
                    />
                    <button
                        type="button"
                        onClick={() => {
                            if(answers.length === 2){
                                alert("Spurning verður að hafa amk 2 svör")
                            }else{
                                const newAnswers = answers.filter((ans, i) => i !== index);
                                setAnswers(newAnswers);
                                if (correctAnswer === index) setCorrectAnswer(null);
                            }
                        }}
                        >
                        Eyða svari!
                    </button>
                </div>
            ))}

            <button type="button" onClick={() => {
                if(answers.length < 6){
                    setAnswers([...answers, { text: '', correct: false }])
                }else{
                    alert("Spurning má að hámarki hafa 6 svör")
                }
                }}>
                Bæta við svari!
            </button>

            <button type="submit">Submit</button>
            </>
        )}
    </form>
  );
}
