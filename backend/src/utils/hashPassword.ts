import bcrypt from 'bcryptjs';

/**
 * Criptografa a senha usando bcrypt
 * @param password - Senha em texto plano
 * @returns Senha criptografada (hash)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

/**
 * Compara a senha fornecida com o hash armazenado
 * @param password - Senha em texto plano
 * @param hashedPassword - Hash armazenado no banco
 * @returns true se a senha está correta, false caso contrário
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}