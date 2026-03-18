export const validators = {
  email: (email) => {
    if (!email) return 'Email обязателен';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Введите корректный email';
    }
    return '';
  },
  name: (name) => {
    if (!name) return 'Имя обязательно';
    if (name.trim().length < 2) return 'Имя должно содержать минимум 2 символа';
    if (name.trim().length > 20) return 'Имя не должно превышать 20 символов';
    if (!/^[a-zA-Zа-яА-Я\s-]+$/.test(name)) {
      return 'Имя может содержать только буквы, пробелы и дефис';
    }
    return '';
  },
  password: (password) => {
    if (!password) return 'Пароль обязателен';
    if (password.length < 8) return 'Пароль должен содержать минимум 8 символов';
    if (password.length > 64) return 'Пароль не должен превышать 64 символа';
    if (!/^[a-zA-Z0-9]+$/.test(password)) {
      return 'Пароль может содержать только латинские буквы и цифры';
    }
    return '';
  },
  passwordConfirmation: (password, confirmPassword) => {
    if (!confirmPassword) return 'Подтверждение пароля обязательно';
    if (password !== confirmPassword) return 'Пароли не совпадают';
    return '';
  },
  verificationCode: (code) => {
    if (!code) return 'Введите код подтверждения';
    if (code.length !== 6) return 'Код должен содержать 6 символов';
    if (!/^\d+$/.test(code)) return 'Код может содержать только цифры';
    return '';
  },
  age: (age) => {
    if (!age) return 'Введите возраст';
    const numAge = parseInt(age);
    if (isNaN(numAge)) return 'Возраст должен быть числом';
    if (numAge < 14) return 'Возраст должен быть не менее 14 лет';
    if (numAge > 90) return 'Возраст должен быть не более 90 лет';
    return '';
  },
  weight: (weight) => {
    if (!weight) return 'Введите вес';
    const numWeight = parseFloat(weight);
    if (isNaN(numWeight)) return 'Вес должен быть числом';
    if (numWeight < 40) return 'Вес должен быть не менее 40 кг';
    if (numWeight > 130) return 'Вес должен быть не более 130 кг';
    return '';
  },
  height: (height) => {
    if (!height) return 'Введите рост';
    const numHeight = parseInt(height);
    if (isNaN(numHeight)) return 'Рост должен быть числом';
    if (numHeight < 140) return 'Рост должен быть не менее 140 см';
    if (numHeight > 210) return 'Рост должен быть не более 210 см';
    return '';
  },
  gender: (gender) => {
    if (!gender) return 'Выберите пол';
    return '';
  },
  equipment: (equipmentId) => {
    if (!equipmentId) return 'Выберите оборудование';
    return '';
  },
  goal: (goalId) => {
    if (!goalId) return 'Выберите цель тренировок';
    return '';
  },
  level: (levelId) => {
    if (!levelId) return 'Выберите уровень подготовки';
    return '';
  },
  agreement: (agree) => {
    if (!agree) return 'Необходимо согласие на обработку персональных данных';
    return '';
  },
  cardNumber: (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (!cleanNumber) return 'Введите номер карты';
    if (!/^\d{16}$/.test(cleanNumber)) return 'Номер карты должен содержать 16 цифр';
    return '';
  },
  cardHolder: (cardHolder) => {
    if (!cardHolder) return 'Введите держателя карты';
    if (!/^[A-Z\s]+$/.test(cardHolder.toUpperCase())) {
      return 'Держатель карты должен содержать только латинские буквы';
    }
    if (cardHolder.length > 50) return 'Держатель карты не должен превышать 50 символов';
    return '';
  },
  expiryMonth: (month) => {
    if (!month) return 'Введите месяц';
    const numMonth = parseInt(month);
    if (isNaN(numMonth) || numMonth < 1 || numMonth > 12) {
      return 'Месяц должен быть от 01 до 12';
    }
    return '';
  },
  expiryYear: (year) => {
    if (!year) return 'Введите год';
    const numYear = parseInt(year);
    const currentYear = new Date().getFullYear() % 100;
    if (isNaN(numYear) || numYear < currentYear || numYear > currentYear + 10) {
      return 'Неверный срок действия карты';
    }
    return '';
  },
  cvv: (cvv) => {
    if (!cvv) return 'Введите CVV';
    if (!/^\d{3}$/.test(cvv)) return 'CVV должен содержать 3 цифры';
    return '';
  }
};