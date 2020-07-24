/* Business Logic independent from external services */
/* To connect to other services we use adaptors and ports */
/* Makes the application more portable by not being tied to just one specific provider */
import { TodoItem } from '../models/TodoItem'
import { DataAccess } from '../dataLogic/dataAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { parseUserId } from '../auth/utils'


const dataAccess = new DataAccess();

export async function getTodos(jwtToken) {
    const userId = parseUserId(jwtToken);
    return dataAccess.getTodoItems(userId);
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    jwtToken: string,
): Promise<TodoItem> {
    const itemId = uuid.v4();
    const userId = parseUserId(jwtToken);

    return dataAccess.createTodo({
        todoId: itemId,
        userId: userId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        createdAt: new Date().toISOString(),
        done: false,
    });
}

export async function updateTodo(
    todoId: string,
    updateTodoRequest: UpdateTodoRequest,
    jwtToken: string,
): Promise<void> {
    const userId = parseUserId(jwtToken);
    const todo = await dataAccess.get(todoId, userId);

    dataAccess.updateTodo(todo.todoId, updateTodoRequest);
}

export async function deleteTodo(
    todoId: string,
    jwtToken: string,
): Promise<void> {
    const userId = parseUserId(jwtToken);
    const todo = await dataAccess.get(todoId, userId);

    await dataAccess.deleteTodo(todo.todoId, todo.userId);
}

export async function setTodoAttachmentUrl(
    todoId: string,
    /*attachmentUrl: string,*/
    jwtToken: string,
): Promise<void> {
    const userId = parseUserId(jwtToken);
    const todo = await dataAccess.get(todoId, userId);

    dataAccess.setAttachmentUrl(todo.todoId);
}