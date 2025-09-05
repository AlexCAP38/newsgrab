import {Task} from '@/types/types';
import {tokenStorage} from '@/utils/tokenStorage';
import {createContext} from 'react';


export interface Context {
    state: State;
    setState: (newState: Partial<State>) => void;
}

export interface State {
    user: {
        token: string | null;
    };
    tasks: Task[];
};

export const initState: Context = {
    state: {
        user: {
            token: tokenStorage.get(),
        },
        tasks: []
    },
    setState: () => { },
}

export const AppContext = createContext<Context>(initState);