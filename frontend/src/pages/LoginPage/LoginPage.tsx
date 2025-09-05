import {Input} from "@/components/ui/input";
import {toast} from "sonner";
import {useEffect, useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {api} from '@services/api';
import {tokenStorage} from "@/utils/tokenStorage";

// import {AppContext} from '@context/Context';

// const b = block('main-page');

/* <div className={b()}>
      <Button />
    </div>
} */


export function LoginPage() {
  // const {state, setState} = useContext(AppContext);
  const navigate = useNavigate();

  //TODO сделать валидацию инпутов
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  function handleLogin() {

    api.user.login({email, password})
      .then((response) => {
        if (response.status === 200 && 'token' in response.data && response.data.token) {
          tokenStorage.set(response.data.token);
          navigate('/');
        }
      })
      .catch((error) => {
        toast.error("Ошибка входа пользователя", {description: error.response.data.message});
        console.log(`Error: ${error.response.status}, Message: ${error.response.data.message}`);
      })
  }

  return (
    <div className='flex flex-col justify-center h-full'>
      <p className='w-full text-[32px] font-semibold text-center'>Вход</p>
      <Input
        type='email'
        placeholder='E-mail'
        id='email'
        className='mt-2'
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <Input
        type='password'
        placeholder='Password'
        id='password'
        className='mt-1'
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <Button
        className='w-full mt-1'
        onClick={handleLogin}
      >
        Войти
      </Button>
      <Button
        className='w-full mt-3'
      >
        Регистрация
      </Button>
    </div>
  );
}
