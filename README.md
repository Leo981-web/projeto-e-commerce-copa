<div align="center">

# ⚽ GolUp
### E-commerce Temático da Copa do Mundo 2026

![React Native](https://img.shields.io/badge/React%20Native-0.79-blue?logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK%2053-000020?logo=expo)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=springboot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)

Um aplicativo mobile desenvolvido como projeto acadêmico, simulando um **e-commerce de artigos esportivos** inspirado na **Copa do Mundo de 2026**.

</div>

---

# 📖 Sobre o Projeto

O **GolUp** é um marketplace mobile onde usuários podem navegar por produtos esportivos, favoritar itens, realizar compras e acompanhar seus pedidos.

Toda a identidade visual foi inspirada em detalhes do meio esportivo, utilizando elementos gráficos, cores e uma experiência voltada para amantes do futebol.

O projeto foi dividido em:
- 📱 Front-end Mobile
- ☕ API em Java
- 🗄 Banco PostgreSQL
- 🔐 Autenticação JWT
- 🌎 Suporte a múltiplos idiomas

---

# 🎯 Objetivos

- Desenvolver um aplicativo de vendas completo utilizando React Native.
- Consumir uma API REST.
- Aplicar autenticação segura.
- Trabalhar arquitetura em camadas e microsserviços.
- Desenvolver uma interface moderna e intuitiva.

---

# ✨ Funcionalidades:

## 👤 Usuário
- Cadastro
- Login
- Recuperação de senha
- Alteração de perfil
- Alteração de idioma
- Tema claro/escuro
- Logout

---

## 🛍 Produtos
- Listagem de produtos
- Busca por nome
- Filtro por categoria
- Visualização de detalhes
- Favoritos
- Carrinho
- Checkout
- Histórico de compras

---

## 👑 Administrador
Além das funções de usuário comum:
- Criar produtos
- Editar produtos
- Excluir produtos

---

# 📱 Telas
- Login
- Cadastro
- Recuperar Senha
- Home
- Produto
- Carrinho
- Pagamento
- Comprovante
- Favoritos
- Perfil
- Histórico
- Sobre
- Suporte
- Configurações
- Avaliações
- Endereços
- Notificações

---

# 🛠 Tecnologias
## Front-end

- React Native
- Expo
- React Navigation
- Context API
- i18n-js
- Expo Localization
- Expo Image Picker
- Ionicons
- Material Icons

## Back-end

- Java
- Spring Boot
- Spring Security
- Spring Cloud Gateway
- OpenFeign
- Netflix Eureka
- JWT
- Hibernate
- Spring Data JPA
- Flyway
- Resilience4j

## Banco de Dados

- PostgreSQL

---

# 🏗 Arquitetura:

## Front-end

```
src/
│
├── assets
├── components
├── context
├── locales
├── routes
├── screens
├── services
└── utils
```

Arquitetura baseada em componentes reutilizáveis e Context API para gerenciamento global de estado.

---

## Back-end

Arquitetura baseada em Microsserviços:

```

├── auth-service/
├── config-service/
├── configs/
├── currency-service/
├── discovery-service/
├── gateway-service/
├── greeting-service/
├── order-service/
├── product-service/
├── docker-compose.yml
└── README.md
```


---

# 🔐 Segurança
- JWT
- Rotas protegidas
- Spring Security
- Criptografia de senha
- Validação de dados

---

# 🌎 Internacionalização
Idiomas disponíveis:
- 🇧🇷 Português
- 🇺🇸 English
- 🇪🇸 Español

---

# 🌙 Temas
O aplicativo possui:
- ☀️ Tema Claro
- 🌑 Tema Escuro/Verde

---

# 🚀 Como executar

## Front-end

```bash
git clone https://github.com/Leo981-web/projeto-e-commerce-copa

cd projeto-e-commerce-copa

npm install

npx expo start
```

---

## Back-end

```bash
git clone https://github.com/MariaLaimer/Microsservices-Copa-Java

docker-compose up --build

```
---

# 👨‍💻 Desenvolvedores:

| Nome | RA |
|------|------|
| Artur Machado Ibáñez | 1137674|
| Jamile Rockenbach Ferreira | 1137704|
| Kauê Anacleto Saggiorato | 1137645|
| Leonardo Manfroi Zancanaro | 1137646 |
| Maria Eduarda Moura Laimer | 1137846 |
| Maria Luiza Pereto |  1138637|
| Tino Markus Bueno Navarro |  1138028|

---

<div align="center">

## ⚽ GolUp

*"A paixão pelo futebol também pode ser digital."*

Projeto desenvolvido para fins acadêmicos.

</div>