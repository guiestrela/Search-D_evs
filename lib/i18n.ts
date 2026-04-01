import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const defaultNS = "common";
export const supportedLanguages = ["en", "pt"] as const;

export const resources = {
  en: {
    common: {
      appTitle: "Developer Search",
      homeTitle: "Find a GitHub profile",
      homeDescription: "Type a GitHub username to view profile details and repositories.",
      usernameLabel: "Username",
      usernamePlaceholder: "e.g. gaearon",
      searchButton: "Search",
      profileTitle: "Profile",
      repositoriesTitle: "Repositories",
      loading: "Loading...",
      notFound: "User not found.",
      backHome: "Back to search",
      followers: "Followers",
      following: "Following",
      publicRepos: "Public repos",
      language: "Language",
      english: "English",
      portuguese: "Portuguese",
      errorLoadingProfile: "Could not load profile.",
      noRepositories: "No repositories found.",
      contact: "Contact",
      updatedAt: "Updated"
    }
  },
  pt: {
    common: {
      appTitle: "Busca de Desenvolvedores",
      homeTitle: "Encontre um perfil do GitHub",
      homeDescription: "Digite um nome de usuário do GitHub para ver perfil e repositórios.",
      usernameLabel: "Usuário",
      usernamePlaceholder: "ex.: gaearon",
      searchButton: "Buscar",
      profileTitle: "Perfil",
      repositoriesTitle: "Repositórios",
      loading: "Carregando...",
      notFound: "Usuário não encontrado.",
      backHome: "Voltar para busca",
      followers: "Seguidores",
      following: "Seguindo",
      publicRepos: "Repositórios públicos",
      language: "Idioma",
      english: "Inglês",
      portuguese: "Português",
      errorLoadingProfile: "Não foi possível carregar o perfil.",
      noRepositories: "Nenhum repositório encontrado.",
      contact: "Contato",
      updatedAt: "Atualizado"
    }
  }
} as const;

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    ns: [defaultNS],
    lng: "en",
    fallbackLng: "en",
    supportedLngs: supportedLanguages,
    load: "languageOnly",
    defaultNS,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });
}

export default i18n;
