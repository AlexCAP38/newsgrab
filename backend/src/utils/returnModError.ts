/**
* Утилита для создания кастомной ошибки
* @param code код ошибки
* @param message текст ошибки
*/

export default function returnModError(code: number, message: string) {
    let err;
    err = new Error(message);
    (err as any).code = code;
    throw err;
}


export interface AppError {
    code: number;
    message: string;
    isAppError: boolean;

}

export function appError(code: number, message: string):AppError {
    return {code, message, isAppError: true};
}