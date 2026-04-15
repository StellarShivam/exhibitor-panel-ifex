import axios from "axios";
import { BASE_URL } from "src/config-global";
const API_URL = `${BASE_URL}/api/v1`; // You can set this to your actual API base URL
export interface Industry {
  id: number;
  name: string;
}
export interface Department {
  id: number;
  name: string;
}
export interface Category {
  id: number;
  name: string;
}

export async function fetchIndustries(): Promise<Industry[]> {
  const res = await axios.get(`${API_URL}/exhibitor/industries`);
  return res.data.data || res.data;
}

export async function fetchDepartments(industryId: number): Promise<Department[]> {
  const res = await axios.get(`${API_URL}/exhibitor/department`, { params: { industryId } });
  return res.data.data || res.data;
}

export async function fetchCategories(departmentId: number): Promise<Category[]> {
  const res = await axios.get(`${API_URL}/exhibitor/categories`, { params: { departmentId } });
  return res.data.data || res.data;
}
