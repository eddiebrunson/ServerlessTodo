import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createTodo } from '../../businessLogic/todos'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createTodoHandler');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('new todo', event)
  console.log("Event:", event)
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
console.log('Processing event: ', event)
logger.info('Processing event: ', event)

const authorization = event.headers.Authorization;
const split = authorization.split(' ');
const jwtToken = split[1]


const todoItem = await createTodo(newTodo, jwtToken)
return {
  statusCode: 201,
  headers: {
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Credentials': true
  },
  body: JSON.stringify({
    item: todoItem
  })
}
}
