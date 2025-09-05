import {Button} from '@/components/ui/button';
import {News} from '@/types/types';
import {DataTable, columns} from '@components/DataTable';
import {useEffect, useState, useContext} from 'react';
import {useNavigate} from 'react-router';
import {Templates} from '@/components/Templates/Templates';
import {AppContext} from '@context/Context';
import {api} from '@/services/api';
import {toast} from "sonner";

export function MainPage() {
  const navigate = useNavigate();
  const {state, setState} = useContext(AppContext);
  const [news, setNews] = useState<News[]>([]);
  const {token} = state.user;

  useEffect(() => {
    if (!token) navigate('/login');

    api.news.getList()
      .then((response) => setNews(response.data))
      .catch((error) => toast.error("Ошибка получения новостей", {description: error}))
    api.tasks.getList()
      .then((response) => {setState({tasks: response.data})})
      .catch((error) => toast.error("Ошибка получения задач", {description: error}))
  }, [token])

  return (
    <div className="flex flex-col max-w-screen px-10">
      <h2 className='text-blue-600 text-2xl font-semibold'>NewsGrab</h2>
      <div className="mt-3 space-x-4">
        <Templates />
        <Button
          className='w-40'
        >
          Фильтра
        </Button>
        <Button
          className='w-40'
        >
          ИИ
        </Button>
      </div>
      <DataTable
        classname='mt-3'
        columns={columns}
        data={news}
      />
    </div>
  );
}
