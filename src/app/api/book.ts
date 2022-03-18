import axios from "app/libs/server/axios";

export interface Book {
  id: number;
  title: string;
  category_id: number;
  authors: [string];
  cover_url: string;
  description: string;
  sections: [
    {
      title: string;
      content: string;
    }
  ];
  audio_length: number;
}

export async function getBooksApi(params: {
  categoryId: number;
  page?: number;
  size?: number;
}): Promise<Book[] | []> {
  try {
    const response = await axios.get("/fee-assessment-books", { params });
    return response.data;
  } catch (error) {
    return [];
  }
}
