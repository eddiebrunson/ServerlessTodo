import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createTodo } from '../../businessLogic/todos'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
/* import { getUserId } from "../../helpers/authHelper"; */
import { getToken } from '../../helpers/authHelper'

const logger = createLogger('createTodoHandler');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('new todo', event)
  console.log("Event:", event)
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  /*const authHeader = event.headers['Authorization'] */ 
  /*const userId = getUserId(authHeader)*/
  /*logger.info(`create todo item for user ${userId} with data ${newTodo}`);*/
  // TODO: Implement creating a new TODO item
console.log('Processing event: ', event)
logger.info('Processing event: ', event)

const jwtToken: string = getToken(event.headers.Authorization)
  /*const todoItems = await createTodo(jwtToken)*/
  

const newItem = await createTodo(newTodo, jwtToken)
console.log(newItem)
return {
  statusCode: 201,
  headers: {
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Credentials': true
  },
  body: JSON.stringify({
    items: newItem
  })
}
}
