import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { ITodo, IUser } from '../shared/interfaces';

import { TodoService } from '../shared/todo.service';
import { UserService } from '../shared/user.service';
import { WakandaService } from '../shared/wakanda.service';

import { ConfirmComponent } from '../shared/confirm/confirm.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent {
  // cols: string[] = ['ID', 'description', 'done', 'chips','tools'];
  cols: string[] = ['description', 'done', 'public', 'chips', 'tools'];
  todos: MatTableDataSource<ITodo> = new MatTableDataSource<ITodo>([]);
  currentTodo: ITodo;
  countTodo = 0;

  userCols: string[] = ['fullName', 'actions'];
  users: MatTableDataSource<IUser> = new MatTableDataSource<IUser>([]);
  users1: MatTableDataSource<IUser> = new MatTableDataSource<IUser>([]);
  currentUser: IUser;
  countUser = 0;

  editable = false;
  isOpenSidePanel: Boolean = false;
// Chips test
  color: string;

  availableColors = [
    { name: 'none', color: '' },
    { name: 'Primary', color: 'primary' },
    { name: 'Accent', color: 'accent' },
    { name: 'Warn', color: 'warn' }
  ];
// End fo chips test

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private todoService: TodoService,
    private usersService: UserService,
    private wakanda: WakandaService,
    private dialog: MatDialog
  ) {
    this.refresh();
  }

  async onSort(a, b, c) {
    const qOptions: any = {
      pageSize: 10,
      start: 0
    };

    if (this.sort.direction) {
      qOptions.orderBy = this.sort.active + ' ' + this.sort.direction;
    }

    const result = await this.todoService.getAll(qOptions);
    this.setData(result);
  }

  async refresh() {
    const result = await this.todoService.getAll();
    this.setData(result);
  }

  async select(todo: ITodo) {
    const result = await todo.getUsers();
    this.users = await new MatTableDataSource(result.entities);
    this.countUser = result._count;
    this.isOpenSidePanel = true;
    this.currentTodo = todo;
  }

  async remove(todo) {
    const isRemoved = await this.todoService.remove(todo);
    if (isRemoved) {
      this.refresh();
    }
  }

  async onNavigate(p) {
    const result = await this.todoService.getAll({
      pageSize: p.pageSize,
      start: p.pageSize * p.pageIndex
    });

    this.setData(result);
  }

  async save(todo) {
    const isSaved = await todo.save();
    this.editable = false;
    if (isSaved) {
      this.refresh();
    }
  }

  cancel() {
    this.editable = false;

    if (this.currentTodo && !this.currentTodo._key) {
      this.isOpenSidePanel = false;
      this.currentTodo = null;
    } else {
      this.refresh();
    }
  }

  async search(value: string, $ev) {
    const v = value ? value.trim() : '';

    if (
      ($ev.keyCode >= 48 && $ev.keyCode <= 57) ||
      ($ev.keyCode >= 65 && $ev.keyCode <= 90) ||
      ([8].indexOf($ev.keyCode) >= 0)
    ) {
      const result = await this.todoService.getAll({
        pageSize: 10,
        start: 0,
        filter: 'description == :1',
        params: [`*${v}*`]
      });
      this.setData(result);
    } else if (!v) {
      this.refresh();
    }
  }

  async create(todo) {
    const Todo = await this.todoService.getClass();
    this.currentTodo = Todo.create();
    this.editable = true;
    this.isOpenSidePanel = true;
  }

  private setData(d: {
    list: ITodo[];
    count: number;
  }) {
    this.todos = new MatTableDataSource<ITodo>(d.list);
    this.countTodo = d.count;
  }

 async removeFromUser(todo: ITodo, user: IUser) {
    const ds = await this.wakanda.catalog;
    const relation = await ds.TodoUser.query({
      filter: 'userAssigned.ID == :1 && todoAssigned.ID == :2',
      params: [user.ID, todo.ID],
      pageSize: 1
    });

    if (relation.entities.length) {
      await relation.entities[0].delete();
    }
    this.select(todo);
  }
}
