import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
/*import { getUserId } from '../../helpers/authHelper'*/
import { updateTodo } from '../../businessLogic/todos'



const logger = createLogger('todos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing UpdateTodo Event: ', event)
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

  /*const authHeader = event.headers.Authorization*/
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1]

  await updateTodo(todoId, updatedTodo, jwtToken);

  return {
    statusCode: 204,
    body: 'update successfull',
};
}