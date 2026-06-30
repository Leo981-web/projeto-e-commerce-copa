import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL + "/auth";

const TOKEN_KEY = "@ECommerceCopa:token";
const USER_KEY  = "@ECommerceCopa:user";

function validateCredentials(email, password) {
  if (!email?.trim() || !password)
    throw new Error("Informe e-mail e senha.");
  if (!email.trim().includes("@"))
    throw new Error("Informe um e-mail válido.");
  if (password.length < 4)
    throw new Error("A senha deve ter pelo menos 4 caracteres.");
}

async function persistSession(data) {
  if (data.token && data.user) {
    await AsyncStorage.setItem(TOKEN_KEY, data.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }
  return data.user;
}

export async function getCurrentUser() {
  const savedUser = await AsyncStorage.getItem(USER_KEY);
  return savedUser ? JSON.parse(savedUser) : null;
}

export async function getToken() {
  return await AsyncStorage.getItem(TOKEN_KEY);
}

export async function signIn(email, password) {
  validateCredentials(email, password);

  const response = await fetch(`${API_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erro ao fazer o login.");
  }

  return persistSession(await response.json());
}

export async function signUp(name, email, password, phone, userType) {
  if (!name?.trim())  throw new Error("Informe seu nome.");
  if (!phone?.trim()) throw new Error("Informe seu telefone.");
  validateCredentials(email, password);

  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name:     name.trim(),
      email:    email.trim(),
      password,
      phone:    phone.trim(),
      type:     userType ?? "Common",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erro ao fazer o cadastro.");
  }

  return persistSession(await response.json());
}

export async function signOut() {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
  return true;
}

export async function updateProfileName(name) {
  if (!name?.trim()) throw new Error("Informe um nome válido.");
  const { error, data } = await supabase.auth.updateUser({ data: { name: name.trim() } });
  if (error) throw new Error("Erro ao atualizar nome: " + error.message);
  return data.user;
}

export async function updateProfileEmail(email) {
  if (!email?.trim() || !email.includes("@")) throw new Error("Informe um e-mail válido.");
  const { error, data } = await supabase.auth.updateUser({ email: email.trim() });
  if (error) throw new Error("Erro ao atualizar e-mail: " + error.message);
  return data.user;
}

export async function updateProfilePhone(phone) {
  if (!phone?.trim()) throw new Error("Informe um telefone válido.");
  const { error, data } = await supabase.auth.updateUser({ data: { phone: phone.trim() } });
  if (error) throw new Error("Erro ao atualizar telefone: " + error.message);
  return data.user;
}

export async function updateProfileAvatar(avatarUrl) {
  const { error, data } = await supabase.auth.updateUser({ data: { avatar_url: avatarUrl } });
  if (error) throw new Error("Erro ao atualizar foto: " + error.message);
  return data.user;
}

export async function sendPasswordResetEmail(email) {
  if (!email?.trim() || !email.includes("@"))
    throw new Error("Por favor, informe um e-mail válido.");
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: 'io.expo.development://',
  });
  if (error) throw new Error(error.message);
  return true;
}