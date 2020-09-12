/*  */
import * as AWS from 'aws-sdk';
import * as AWSXRAY from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';
import { createLogger } from '../utils/logger'

/* Creates an instance of AWS Clients using XRay SDK */
const XAWS = AWSXRAY.captureAWS(AWS);
const logger = createLogger(XAWS)

export class DataAccess {
    constructor(
        /*This parameter works with DynamoDB*/
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
      private readonly bucketName = process.env.S3_BUCKET,
      /*private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,*/
        /*This parameter is the name of the table where todos are stored*/
      private readonly todosTable = process.env.TODOS_TABLE,
      private readonly bucketUrl = process.env.S3_BUCKET_URL
    ) { }

async getTodoItems(userId) {
    console.log('Get all todos')
    const result  = await this.docClient. query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    })
    .promise();

   
   return result.Items
}

async get(todoId, userId){
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

    
    return result.Items[0]
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
   await this.docClient.update({
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

async setTodoAttachmentUrl(todoId: string, userId: string, imageExt: string = '.png'): Promise<string> {
  logger.info('Generating upload Url')
  console.log('Generating upload Url')
  
    const url = await this.s3.getSignedUrl('putObject', {
        Bucket: this.bucketName,
        Key: todoId,
        Expires: 10000,
    });
    console.log(url);

await this.docClient.update({
  TableName: this.todosTable,
  Key: { 
      "userId":userId,
      "todoId":todoId
      
  },
  UpdateExpression: "set attachmentUrl=:URL",
  ExpressionAttributeValues: {
    ":URL": `${this.bucketUrl}${todoId}${imageExt}`
  },
  ReturnValues: "UPDATED_NEW"
  })
  .promise();
return url;
}


async deleteTodo(todoId: string, userId: string) {
  const deleteTodo = await this.docClient.delete({
        TableName: this.todosTable,
        Key: {
            userId: userId,
            todoId: todoId,
          },
        })
        .promise();
      return { Deleted: deleteTodo };
    }
}