export interface ITodo {
  ID: string;
  description: string;
  done: boolean;
  _key?: string;
  type: ITodoType;
  users?: {
    entities: IUser[];
    fetch(): Promise<IUser[]>;
  };
  subTodos?: ITodo[];
  mainTodo?: ITodo;
  save(): void;
  delete(): void;
  removeTodo(): void;
  getUsers(): Promise<{
    entities: IUser[];
    _count: number;
  }>;
}

export interface IUser {
  ID: string;
  email: string;
  fullName: string;
  group: string;
  _key?: string;
  getTodos(): Promise<{
    entities: ITodo[];
    _count: number;
  }>;
}

export interface ITodoType {
  ID: string;
  choiceDescription: string;
  choiceCategory: string;
  _key?: string;
  todoTyped: {
    entities: ITodo[];
    fetch(): Promise<ITodo[]>;
  };
}

export interface IDocument {
  ID: string;
  docCode: string;
  docTitle: string;
  docCategory: string;
  docFile?: string;
  docRecordDate?: string;
}
