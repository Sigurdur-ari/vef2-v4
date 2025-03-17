import { Category, Question, QuestionData } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:8000';

export class QuestionsApi {
  async fetchFromApi<T>(url: string): Promise<T | null> {
    let response: Response | undefined;
    try {
      response = await fetch(url);
    } catch (e) {
      console.error('error fetching from api', url, e);
      return null;
    }

    if (!response.ok) {
      console.error('non 2xx status from API', url);
      return null;
    }

    let json: unknown;
    try {
      json = await response.json();
    } catch (e) {
      console.error('error parsing json', url, e);
      return null;
    }

    return json as T;
  }

  async getCategory(slug: string): Promise<Category | null> {
    const url = BASE_URL + `/categories/${slug}`;

    const response = await this.fetchFromApi<Category | null>(url);

    return response;
  }

  async getCategories(): Promise<Array<Category> | null> {
    const url = BASE_URL + '/categories';

    const response = await this.fetchFromApi<Array<Category>>(url);

    // TODO hér gæti ég staðfest gerð gagna

    return response;
  }

  async getQuestionsForCategory(cat_id: number): Promise<Array<Question> | null>{
    console.log("category id -> ", cat_id)
    const url = BASE_URL + `/questions/${cat_id}`;

    const response = await this.fetchFromApi<Array<Question>>(url);

    //TODO sama mögulega hér. 

    return response;
  }

  async createQuestion(question: QuestionData): Promise<Question | null | string>{
    const url = BASE_URL + `/questions`;

    try{
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(question)
      });

      //Aðstoð við villumeðhöndlun fengin frá ChatGPT
      if(response.status === 400){
        //túlka villuna sem json þar sem API skilar json villum fyrir 400 status
        const errorResponse = await response.json();

        const errorMessage = errorResponse.error || 'Unknown error occurred';
        const fieldErrors = errorResponse.errors?.fieldErrors || {};

        //Túlka allar fieldError villur til að birta allt sem var að
        for (const field in fieldErrors) {
          if (fieldErrors[field].length > 0) {
            console.error(`${field}: ${fieldErrors[field].join(', ')}`);
          }
        }
        //skila streng af villum. 
        return `${errorMessage}: ${JSON.stringify(fieldErrors)}`;
      }

      if(!response.ok){
        console.error("Failed to create question ", response.statusText);
      }

      return await response.json();

    }catch(e){
      console.error("Error creating question ", e);
      return null; 
    }
  }
}
