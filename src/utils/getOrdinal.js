export default function getOrdinal(num) {
  const ordinals = [
    'нулевой', 'первый', 'второй', 'третий', 'четвёртый',
    'пятый', 'шестой', 'седьмой', 'восьмой', 'девятый', 'десятый'
  ];

  return ordinals[num] ? ordinals[num] : 'Нет значения';
}
