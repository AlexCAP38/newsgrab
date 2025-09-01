import type {ColumnDef} from "@tanstack/react-table"

export type News = {
    id: string;
    topic: string;
    news: string;
    date: string;
    resource: string;
    link: string;
}

export const columns: ColumnDef<News>[] = [
    {
        accessorKey: "resource",
        header: "Источник",
    },
    {
        accessorKey: "topic",
        header: "Категория",
    },
    {
        accessorKey: "news",
        header: "Новость",
    },
    {
        accessorKey: "date",
        header: "Дата публикации",
    },
]
