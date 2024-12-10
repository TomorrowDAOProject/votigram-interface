export enum APP_CATEGORY {
  NEW = "New",
  EARN = "Earn",
  GAME = "Game",
  FINANCE = "Finance",
  SOCIAL = "Social",
  UTILITY = "Utility",
  INFORMATION = "Information",
  ECOMMERCE = "Ecommerce",
}

export const DISCOVERY_CATEGORY_MAP = {
  [APP_CATEGORY.NEW]: "✨ New",
  [APP_CATEGORY.EARN]: "💰 Earn",
  [APP_CATEGORY.GAME]: "🎮 Game",
  [APP_CATEGORY.FINANCE]: "💵 Finance",
  [APP_CATEGORY.SOCIAL]: "💬 Social",
  [APP_CATEGORY.UTILITY]: "🔩 Utility",
  [APP_CATEGORY.INFORMATION]: "💰 Information",
  [APP_CATEGORY.ECOMMERCE]: "🛒 E-commerce",
};

export const DISCOVER_CATEGORY: {
  value: APP_CATEGORY;
  label: string;
}[] = [
  {
    value: APP_CATEGORY.NEW,
    label: "✨ New",
  },
  {
    value: APP_CATEGORY.EARN,
    label: "💰 Earn",
  },
  {
    value: APP_CATEGORY.GAME,
    label: "🎮 Game",
  },
  {
    value: APP_CATEGORY.FINANCE,
    label: "💵 Finance",
  },
  {
    value: APP_CATEGORY.SOCIAL,
    label: "💬 Social",
  },
  {
    value: APP_CATEGORY.UTILITY,
    label: "🔩 Utility",
  },
  {
    value: APP_CATEGORY.INFORMATION,
    label: "💰 Information",
  },
  {
    value: APP_CATEGORY.ECOMMERCE,
    label: "🛒 E-commerce",
  },
];
