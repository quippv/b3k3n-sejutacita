import axios from "app/libs/server/axios";

export interface Category {
  id: number;
  name: string;
  active?: boolean;
  icon?: string;
}

export async function getCategoriesApi(): Promise<Category[]> {
  const response = await axios.get("/fee-assessment-categories");
  return response.data;
}
