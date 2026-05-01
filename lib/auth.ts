export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const saveAuth = (token: string, user: User) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};