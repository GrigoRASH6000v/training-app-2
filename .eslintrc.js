module.exports = {
  root: true, // Означает, что ESLint не будет искать настройки выше по дереву каталогов
  env: {
    node: true, // Включает глобальные переменные Node.js
  },
  extends: [
    'plugin:vue/vue3-essential', // Использует базовые правила для Vue 3
    'eslint:recommended',        // Рекомендуемые правила от ESLint
  ],
  parserOptions: {
    ecmaVersion: 2020, // Позволяет использовать современный JS
  },
  rules: {
    // Свои правила — можно переопределить стандартные
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // В проде предупреждать об использовании console
    'vue/no-unused-vars': 'error', // Ошибка если есть неиспользуемые переменные во Vue
    'indent': ['error', 2], // Требуется отступ в 2 пробела
    'quotes': ['error', 'single'], // Только одинарные кавычки
    'semi': ['error', 'always'], // Всегда ставить точку с запятой
    'vue/multi-word-component-names': 'off',
  },
};
