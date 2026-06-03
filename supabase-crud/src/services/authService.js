export async function signIn(email, password) {
  if (!email || !password) {
    throw new Error('Informe e-mail e senha.');
  }

  if (!email.includes('@')) {
    throw new Error('Informe um e-mail válido.');
  }

  if (password.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres.');
  }

  return {
    id: 'user-1',
    name: 'Professor',
    email,
  };
}

export async function signUp(name, email, password) {
  if (!name || !email || !password) {
    throw new Error('Informe nome, e-mail e senha.');
  }

  if (!email.includes('@')) {
    throw new Error('Informe um e-mail válido.');
  }

  if (password.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres.');
  }

  return {
    id: String(Date.now()),
    name,
    email,
  };
}

export async function signOut() {
  return true;
}
