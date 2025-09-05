import {News} from "@/types/types"
import type {ColumnDef} from "@tanstack/react-table"

export const columns: ColumnDef<News>[] = [
    {
        accessorKey: "resource",
        header: "Источник",
        size: 20
    },
    {
        accessorKey: "topic",
        header: "Категория",
        size: 30
    },
    {
        accessorKey: "header",
        header: "Новость",
        size: 200
    },
    {
        accessorKey: "date",
        header: "Дата публикации",
        size: 35
    },
]
