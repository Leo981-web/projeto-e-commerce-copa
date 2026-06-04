import { supabase } from "./supabase";

function mapUser(user) {
  if (!user) {
    return null;
  }

  const metadata = user.user_metadata ?? {};

  return {
    id: user.id,
    name: metadata.name ?? user.name ?? user.email,
    email: user.email,
  };
}

function validateCredentials(email, password) {
  if (!email?.trim() || !password) {
    throw new Error("Informe e-mail e senha.");
  }

  if (!email.trim().includes("@")) {
    throw new Error("Informe um e-mail válido.");
  }

  if (password.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres.");
  }
}

export async function signIn(email, password) {
  validateCredentials(email, password);

  const { error, data } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    throw new Error("Erro ao fazer o login: " + error.message);
  }

  return mapUser(data.user);
}

export async function signUp(name, email, password) {
  if (!name?.trim()) {
    throw new Error("Informe seu nome.");
  }

  validateCredentials(email, password);

  const { error, data } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        name: name.trim(),
      },
    },
  });

  if (error) {
    throw new Error("Erro ao fazer o cadastro: " + error.message);
  }

  return mapUser(data.user);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("Erro ao sair: " + error.message);
  }

  return true;
}

export async function getCurrentUser() {
  const { error, data } = await supabase.auth.getSession();

  if (error) {
    throw new Error("Erro ao recuperar sessão: " + error.message);
  }

  return mapUser(data.session?.user);
}
