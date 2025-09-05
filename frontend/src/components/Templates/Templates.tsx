import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Badge} from "@/components/ui/badge";
import {AppContext} from "@/context/Context";
import {api} from "@/services/api";
import {Task, Template} from "@/types/types";
import {useContext, useEffect, useState} from "react";
import deleteIcon from '@assets/x-square.svg';
import moveIcon from '@assets/arrow-right-circle.svg';
import {toast} from "sonner";

export const Templates = () => {
    const {state, setState} = useContext(AppContext);
    const {tasks} = state;
    const [templates, setTemplates] = useState<Template[]>([]);

    useEffect(() => {
        api.templates.getList().then((response) => setTemplates(response.data));
    }, [])

    function handleDeleteTask(task: Task) {
        api.tasks.deleteTask(task.id)
            .then((response) => {
                setState({tasks: response.data});
                toast.info("Задача удалена", {description: task.name})
            })
    }

    function handleCreateTask(task: Template) {
        api.tasks.createTask({
            name: task.name,
            templateId: task.id
        })
            .then((response) => {
                setState({tasks: response.data});
                toast.info("Задача создана", {description: task.name})
            })
            .catch((error)=>{
                toast.info("Ошибка, задача создана", {description: error.response.data.message})
            })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-40 relative" variant="default">
                    Шаблоны
                    {
                        tasks.length > 0 && <Badge
                            className="absolute right-[5%]"
                            variant='destructive'>{tasks.length}</Badge>
                    }
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[1000px]">
                <DialogHeader>
                    <DialogTitle className="text-blue-600">Шаблоны</DialogTitle>
                    <DialogDescription>Откуда забирать новости</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-2">
                    <p className="text-xl inline-block">Библиотека шаблонов</p>
                    <p className="text-xl inline-block">Текущие задачи сборщика</p>
                    <div className="h-[300px] overflow-y-auto">
                        {
                            templates.map((item) =>
                                <div
                                    className="flex h-8 border rounded-sm items-center px-3 mt-1 hover:cursor-pointer justify-between group"
                                    key={item.id}
                                    onClick={() => handleCreateTask(item)}
                                >
                                    {item.name}
                                    <img
                                        className="hidden group-hover:block"
                                        src={moveIcon}
                                        alt="Переместить в задачу" />
                                </div>
                            )
                        }
                    </div>
                    <div className="h-[300px] overflow-y-auto">
                        {
                            tasks.map((item) =>
                                <div
                                    className="flex h-8 border rounded-sm items-center px-3 mt-1 hover:cursor-pointer justify-between group"
                                    key={item.id}
                                    onClick={() => handleDeleteTask(item)}
                                >
                                    {item.name}
                                    <img
                                        className="hidden group-hover:block"
                                        src={deleteIcon}
                                        alt="Удалить задачу" />
                                </div>
                            )
                        }

                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="default">Закрыть</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
