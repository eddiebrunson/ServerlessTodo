import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { updateTodo } from '../../businessLogic/todos'




const logger = createLogger('todos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing UpdateTodo Event: ', event)
  
  

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const todoId = event.pathParameters.todoId
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  await updateTodo(todoId, updatedTodo, jwtToken);

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
}
}
