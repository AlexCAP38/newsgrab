import './MainPage.css';
import type {News} from '@components/DataTable';
import {DataTable, columns} from '@components/DataTable';


import React, {useEffect, useState, useContext} from 'react';
import {Outlet, useNavigate} from 'react-router';
// import {AppContext} from '@context/Context';

// const b = block('main-page');

/* <div className={b()}>
      <Button />
    </div>
} */





const payments: News[] = [
  {
    id: "728ed52f",
    date: '100',
    news: "pending",
    resource: "m@example.com",
    topic: 'СПОРТ',
    link: 'http://ya.ru'
  },
  {
    id: "489e1d42",
    date: '24235352',
    news: "processing",
    resource: "example@gmail.com",
    topic: 'ЖИЗНЬ',
    link: 'http://ya.ru'
  },

]






export function MainPage() {
  // const {state, setState} = useContext(AppContext);

  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <DataTable columns={columns} data={payments} />
    </div>
  );
}
