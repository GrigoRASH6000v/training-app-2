module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
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
