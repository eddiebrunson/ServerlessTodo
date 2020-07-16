/*  */
import * as AWS from 'aws-sdk';
import * as AWSXRAY from 'aws-xray-sdk';
/*import { DocumentClient } from 'aws-sdk/clients/dynamodb';*/

import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';

/* Creates an instance of AWS Clients using XRay SDK */
const XAWS = AWSXRAY.captureAWS(AWS);

export class DataAccess {
    constructor(
        /*This parameter works with DynamoDB*/
       /* private readonly documentClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),*/
       private readonly docClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        /*This parameter is the name of the table where todos are stored*/
        private readonly todosTable = process.env.TODOS_TABLE,
    ) { }

async getTodoItems (userId: string): Promise<TodoItem[]>{
    console.log('Get all todos')
    const result = await this.docClient. query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    })
    .promise();

   const item = result.Items
    /*return result.Items as TodoItem[]*/
   return item as TodoItem[];
}

async get(todoId: string, userId: string): Promise<TodoItem> {
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: 'todoId = :todoId and userId = :userId',
        ExpressionAttributeValues: {
          ':todoId': todoId,
          ':userId': userId,
        },
      })
      .promise();

    const item = result.Items[0];
    return item as TodoItem;
  }


async createTodo(todoItem: TodoItem): Promise<TodoItem> { 
    await this.docClient
       .put({
           TableName: this.todosTable,
           Item: todoItem
       })
       .promise()
    return todoItem
}

async updateTodo(todoId: string,
    todoUpdate: TodoUpdate,
): Promise<void> {
    this.docClient.update({
        TableName: this.todosTable,
        Key: {
            ':todoId': todoId
        },
        UpdateExpression: 'set #n = :name, done =:done, dueDate = :d',
        ExpressionAttributeValues: {
            ':name': todoUpdate.name,
            ':done': todoUpdate.done,
            ':d': todoUpdate.dueDate,
        },
        ExpressionAttributeNames: {
            '#n': 'name',
        },
    }).promise()
}

async setAttachmentUrl(
    todoId: string,
    userId: string,
    attachmentUrl: string,
  ): Promise<void> {
    this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId,
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl,
        },
        ReturnValues: 'UPDATED_NEW',
      })
      .promise();
  }

async deleteTodo(todoId: string, userId): Promise<void> {
    this.docClient.delete({
        TableName: this.todosTable,
        Key: {
            userId,
            todoId,
          },
        })
        .promise();
    }
}

