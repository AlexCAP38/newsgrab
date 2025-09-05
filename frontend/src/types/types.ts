export interface News {
  id: string;
  topic: string;
  header: string;
  link: string;
  subtitle: string;
  date: string;
  userId: string;
  resource: string;
}

export interface Template {
    id: string,
    name: string,
    userId: string
}

export interface Task {
    id: string,
    name: string,
    userId: string,
    templateId: string
}