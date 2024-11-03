export const createUser  = async (userData: {
  email: string;
  password: string;
  name: string;
}) => {
  return { user: 'Usman Shaikh' };
};

export const authenticateUser  = async (email: string, password: string) => {
  return { user: 'Usman Shaikh', token: '123456789' };
};
