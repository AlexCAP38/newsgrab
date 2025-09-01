import './LoginPage.css';
import {Input} from "@/components/ui/input"
import React, {useEffect, useState, useContext} from 'react';
import {Outlet, useNavigate} from 'react-router';
import {clsx} from 'clsx';
import {Button} from '@/components/ui/button';

// import {AppContext} from '@context/Context';

// const b = block('main-page');

/* <div className={b()}>
      <Button />
    </div>
} */


export function LoginPage() {
  // const {state, setState} = useContext(AppContext);

  return (
    <div>
      <p className={clsx('title')}>Вход</p>
      <Input
        type='email'
        placeholder='E-mail'
        id='email'
        className={clsx('input')}
      />
      <Input
        type='password'
        placeholder='Password'
        id='password'
        className={clsx('input')}
      />
      <Button
        className={clsx('btn')}
      >
        Войти
      </Button>
      <Button
        className={clsx('btn')}
      >
        Регистрация
      </Button>
    </div>
  );
}
