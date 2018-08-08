import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../shared/user.service';
import { IUser, ITodo } from '../shared/interfaces';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TodoService } from '../shared/todo.service';
import { WakandaService } from '../shared/wakanda.service';
import { ConfirmComponent } from '../shared/confirm/confirm.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  currentUser: IUser;
  currentTodo: ITodo;
  usersCount: number;
  todoCount: number;
  userCols: string[] = ['email', 'fullname'];
  users: MatTableDataSource<IUser> = new MatTableDataSource<IUser>([]);
  todoCols: string[] = ['description', 'done', 'actions'];
  todoCols1: string[] = ['description', 'done'];
  todos: MatTableDataSource<ITodo> = new MatTableDataSource<ITodo>([]);
  todos1: MatTableDataSource<ITodo> = new MatTableDataSource<ITodo>([]);

  @ViewChild(MatPaginator) usersPaginator: MatPaginator;

  constructor(
    private usersService: UserService,
    private todosService: TodoService,
    private wakanda: WakandaService,
    private dialog: MatDialog
  ) { }

  async ngOnInit() {
    const result = await this.usersService.getAll();
    const todos = await this.todosService.getAll({
      pageSize: 20,
      start: 0
    });
    this.todos1 = new MatTableDataSource(todos.list);
    this.setData(result);
  }

  async select(user: IUser){
    const result = await user.getTodos();
    this.todos = new MatTableDataSource(result.entities);
    this.todoCount = result._count;
    this.currentUser = user;
  }

  async onNavigate(p) {
    const result = await this.usersService.getAll({
      pageSize: p.pageSize,
      start: p.pageSize*p.pageIndex
    });

    this.setData(result);
  }

  setData(d: {
    list: IUser[];
    count: number;
  }) {
    this.users = new MatTableDataSource(d.list);
    this.usersCount = d.count;
  }

  async affect(user: IUser, todo: ITodo){
    const ds = await this.wakanda.catalog;
    const relation = ds.TodoUser.create();
    relation.userAssigned = user;
    relation.todoAssigned = todo;
    relation.comments = "Web assign Try."
    relation.save();
    this.select(user);
  }

  async removeFromUser(user: IUser, todo: ITodo){
    const ds = await this.wakanda.catalog;
    const relation = await ds.TodoUser.query({
      filter: 'userAssigned.ID == :1 && todoAssigned.ID == :2',
      params: [user.ID, todo.ID],
      pageSize: 1
    });

    if(relation.entities.length){
      await relation.entities[0].delete();
    }
    this.select(user);
  }


  async removeTodo(user: IUser, todo: ITodo):
    Promise<any> {
      let dialogRef = this.dialog.open(ConfirmComponent, {
        width: '250px',
        data: { message: "Would you like to remove definitvely this todo?" }
      });

      return new Promise((resolve, reject) => {
        dialogRef.afterClosed().subscribe(async isYes => {
          if(isYes){
            await todo.delete();
          }

          resolve(isYes);
        });
      });
  }
}
