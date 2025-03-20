const API_URL = "https://jsonplaceholder.typicode.com/users";

interface User {
  id: number;
  name: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};
