import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
/*import { getUserId } from '../../helpers/authHelper'*/

import { updateTodo } from '../../businessLogic/todos'
import { getToken } from '../../helpers/authHelper'



const logger = createLogger('todos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing UpdateTodo Event: ', event)
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

  /*const authHeader = event.headers.Authorization*/
  
  const jwtToken: string = getToken(event.headers.Authorization)

  await updateTodo(todoId, updatedTodo, jwtToken);

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: 'update successful',
};
}

/*
import "source-map-support/register";
import { updateTodo } from "../../BusinessLogic/todos";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from "aws-lambda";
 
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent)

: Promise<APIGatewayProxyResult> => {

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

  const updatedToDo = await updateTodo(event);

  return {

    statusCode: 200,

    headers: {

      "Access-Control-Allow-Origin": "*",

      "Access-Control-Allow-Credentials": true

    },

    body: JSON.stringify({ msg: "T0-do has been updated", updated: updatedToDo })

  };
};
*/