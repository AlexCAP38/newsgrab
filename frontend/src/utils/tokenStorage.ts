const TOKEN_KEY = 'token';

class TokenStorage {

    set(token: string) {
        localStorage.setItem(TOKEN_KEY, token);
    }

    setSession(token: string) {
        sessionStorage.setItem(TOKEN_KEY, token);
    }

    get() {
        const lsToken = localStorage.getItem(TOKEN_KEY);
        if (lsToken) {
            return lsToken;
        }
        const ssToken = sessionStorage.getItem(TOKEN_KEY);
        return ssToken;
    }

    clear() {
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
    }
}

export const tokenStorage = new TokenStorage();
