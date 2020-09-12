/* Business Logic independent from external services */
/* To connect to other services we use adaptors and ports */
/* Makes the application more portable by not being tied to just one specific provider */
import { TodoItem } from '../models/TodoItem'
import { DataAccess } from '../dataLogic/dataAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
/*import { getUserId } from '../helpers/authHelper'*/
import { parseUserId } from '../auth/utils'
/*import { APIGatewayProxyEvent } from 'aws-lambda'*/


const dataAccess = new DataAccess();

export async function getTodos(jwtToken) {
    const userId = parseUserId(jwtToken);
    return dataAccess.getTodoItems(userId);
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    jwtToken: string,
): Promise<TodoItem> {
    const todoId = uuid.v4();
    const userId = parseUserId(jwtToken);

    return dataAccess.createTodo({
        todoId: todoId,
        userId: userId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        createdAt: new Date().toISOString(),
        done: false,
    });
}
/*
export async function updateTodo( event: APIGatewayProxyEvent){
    
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
    const newTodo = await dataAccess.updateTodo(userId, todoId, updatedTodo);
       return newTodo
}*/

export async function updateTodo(
    todoId: string,
    updateTodoRequest: UpdateTodoRequest,
    jwtToken: string,
): Promise<void> {
    const userId = parseUserId(jwtToken);
    const todo = await dataAccess.get(todoId, userId);

    dataAccess.updateTodo(todo.todoId, todo.userId, updateTodoRequest);
}

export async function deleteTodo(
    todoId: string,
    jwtToken: string,
): Promise<void> {
    const userId = parseUserId(jwtToken);
    const todo = await dataAccess.get(todoId, userId);

    await dataAccess.deleteTodo(todo.todoId, todo.userId);
}

export async function setTodoAttachmentUrl(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken)
    console.log("Setting Item URL")
    console.log(todoId)
    console.log("userId:",userId)
    const todoItem = await dataAccess.get(todoId, userId)

    return await dataAccess.setTodoAttachmentUrl(todoItem.todoId, todoItem.userId);
    }