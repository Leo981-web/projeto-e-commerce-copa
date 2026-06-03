let currentUser = null;
let lastUserId = 1;

function mapUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

function validateCredentials(email, password) {
  if (!email || !password) {
    throw new Error("Informe e-mail e senha.");
  }

  if (!email.includes("@")) {
    throw new Error("Informe um e-mail válido.");
  }

  if (password.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres.");
  }
}

export async function signIn(email, password) {
  validateCredentials(email, password);

  currentUser = {
    id: "user-mock",
    name: email.split("@")[0],
    email,
  };

  return mapUser(currentUser);
}

export async function signUp(name, email, password) {
  if (!name) {
    throw new Error("Informe seu nome.");
  }

  validateCredentials(email, password);

  currentUser = {
    id: `user-${lastUserId}`,
    name,
    email,
  };

  lastUserId += 1;

  return mapUser(currentUser);
}

export async function signOut() {
  currentUser = null;
  return true;
}
