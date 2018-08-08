import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ITodo, IUser, ITodoType } from '../shared/interfaces';

import { TodoService } from '../shared/todo.service';
import { ConfirmComponent } from '../shared/confirm/confirm.component';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.component.html',
  styleUrls: ['./todo-details.component.css']
})
export class TodoDetailsComponent implements OnInit {
  editable: boolean = false;
  current: ITodo ;
  todoCols1: string[] = ['description', 'done', 'public'];
  todos1: MatTableDataSource<ITodo> = new MatTableDataSource<ITodo>([]);
  users: IUser[];
  types: ITodoType[] = [];
  selectedTypeTodo: ITodoType;

  constructor(
    private route: ActivatedRoute,
    private todoService: TodoService,
    private userService: UserService,
    private router: Router
  ) { }

 async ngOnInit() {

  // Get all the "types todo" 
    const TodoType = await this.todoService.getTypesClass();
    const Todo = await this.todoService.getClass();
    this.types = (await TodoType.query()).entities;
  // Based on p witch is the selected Todo in the list, fetch the detail of the todo
    this.route.params.subscribe(async p => {
      const Todo = await this.todoService.getClass();
      // const todoexpanded = await Todo.find(p.id, {expand: 'users'}); // Expand does not work
      this.current = await Todo.find(p.id, {select: 'users, mainTodo, type'}); //, mainTodo, type'});
  // Affect the value for the type of todo 
    if(this.current && this.current.type){
      this.selectedTypeTodo = this.types.find(t => t._key === this.current.type._key);
    }
  // Contruct list of todos to select for add as main todo
      const todos1 = await this.todoService.getAll({
        pageSize: 20,
        start: 0
      });
      this.todos1 = new MatTableDataSource(todos1.list);

  // Contruct the list of users concerned
     this.users = this.current.users.entities;
     const result = await this.current.getUsers();
     const users = result.entities;
     const countUser = result._count;
    });

    this.route.data.subscribe(d => {
      this.editable = d.editable;
      // Let allow edition or not, withdraw the colomn 'tools' if not editable
      this.todoCols1 = this.editable? ['description', 'done', 'public', 'tools']: ['description', 'done' , 'public'];
    });
  }

  async save(todo){
    await todo.save();
    this.editable= false;
  //this.router.navigate(["/todos"]);
  }

  async remove(todo){
    await this.todoService.remove(todo);
    this.router.navigate(["/todos"]);
  }

  async create(todo){
    const Todo = await this.todoService.getClass();
    this.current = Todo.create();
  }

  cancel(){
    this.editable= false;
  }

  // async affect(todoSub: ITodo, todoMain: ITodo[]){
  //   this.current.subTodos= todoMain;
  //   this.save(todoSub);
  // }

  async makeMain(t: ITodo, current: ITodo) {
    // To avoid the possibility to be its own main
    if(!current || !t || t.ID === current.ID){
      return false;
    }
    current.mainTodo = t;
    await current.save();
  }

  async setType(current: ITodo, type: ITodoType){
    if(!current || !type){
      return false;
    }
    current.type = type;
    await current.save();
  }
}


