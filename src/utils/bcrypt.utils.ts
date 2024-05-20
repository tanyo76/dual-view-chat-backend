import * as bcrypt from 'bcrypt';

export const hashPassword = async (plainPassword: string) => {
  const salt = 10;
  const hashedPw = await bcrypt.hash(plainPassword, salt);
  return hashedPw;
};

export const comparePasswordHash = async (
  plainPassword: string,
  hashedPassword: string,
) => {
  const isCorrectPassword = await bcrypt.compare(plainPassword, hashedPassword);
  return isCorrectPassword;
};
