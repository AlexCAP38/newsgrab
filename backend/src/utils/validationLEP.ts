/**
 * Утилита валидации Login, Email, Password
 * @param login
 * @param email
 * @param password
 * @returns
 */

export default function validationLEP(login: string, email: string, password: string) {

    const errors: string[] = [];

    // проверка на пустоту, длину
    if (!login || login.length <= 2) errors.push('Login is required and must be at least 3 characters');

    // проверка по шаблону на емаил
    const emailRegExp = /^[a-z0-9._%+-]+@(?:[a-z0-9-]+\.)+[a-z]{2,}$/gmi;
    if (!email || !emailRegExp.test(email)) errors.push('Email is invalid');

    // пароль должен быть 8 знаком и не содержать кириллицу
    const passwordRegExp = /^(?=[^а-яА-ЯёЁ]*$)[\S]{8,}$/gmi;
    if (!password || !passwordRegExp.test(password)) errors.push('Password must be at least 8 characters and contain no Cyrillic');

    return errors;
}
