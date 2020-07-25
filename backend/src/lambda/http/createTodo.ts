import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createTodo } from '../../businessLogic/todos'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getToken } from '../../helpers/authHelper'

const logger = createLogger('createTodoHandler');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('new todo', event)
  console.log("Event:", event)
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
console.log('Processing event: ', event)
logger.info('Processing event: ', event)

const jwtToken: string = getToken(event.headers.Authorization)
  /*const todoItems = await createTodo(jwtToken)*/
  

const todoItems = await createTodo(newTodo, jwtToken)
console.log(todoItems)
return {
  statusCode: 201,
  headers: {
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Credentials': true
  },
  body: JSON.stringify({
    items: todoItems
  })
}
}
