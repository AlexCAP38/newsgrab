export default function returnModError(code: number, message: string) {
    let err;
    err = new Error(message);
    (err as any).code = code;
    throw err;
}