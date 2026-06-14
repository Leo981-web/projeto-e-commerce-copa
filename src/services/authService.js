import { supabase } from "./supabase";

export async function sendPasswordResetEmail(email) {
  if (!email?.trim() || !email.trim().includes("@")) {
    throw new Error("Informe um e-mail válido.");
  }
  
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return true;
}

export async function updatePassword(newPassword) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres.");
  }

  
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return true;
}
function mapUser(user) {
  if (!user) {
    return null;
  }

  const metadata = user.user_metadata ?? {};

  return {
    id: user.id,
    name: metadata.name ?? user.name ?? user.email,
    email: user.email,
    avatar_url: metadata.avatar_url ?? null,
    phone: metadata.phone ?? null,
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

// ============================================================
// Funções de atualização de perfil
// ============================================================

export async function updateProfileName(name) {
  if (!name?.trim()) {
    throw new Error("Informe um nome válido.");
  }

  const { error, data } = await supabase.auth.updateUser({
    data: { name: name.trim() },
  });

  if (error) {
    throw new Error("Erro ao atualizar nome: " + error.message);
  }

  return mapUser(data.user);
}

export async function updateProfileEmail(email) {
  if (!email?.trim() || !email.includes("@")) {
    throw new Error("Informe um e-mail válido.");
  }

  const { error, data } = await supabase.auth.updateUser({
    email: email.trim(),
  });

  if (error) {
    throw new Error("Erro ao atualizar e-mail: " + error.message);
  }

  return mapUser(data.user);
}

export async function updateProfilePhone(phone) {
  if (!phone?.trim()) {
    throw new Error("Informe um telefone válido.");
  }

  const { error, data } = await supabase.auth.updateUser({
    data: { phone: phone.trim() },
  });

  if (error) {
    throw new Error("Erro ao atualizar telefone: " + error.message);
  }

  return mapUser(data.user);
}

export async function updateProfileAvatar(avatarUrl) {
  const { error, data } = await supabase.auth.updateUser({
    data: { avatar_url: avatarUrl },
  });

  if (error) {
    throw new Error("Erro ao atualizar foto: " + error.message);
  }

  return mapUser(data.user);
}