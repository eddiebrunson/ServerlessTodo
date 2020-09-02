import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import * as AWSXRay from 'aws-xray-sdk';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk';
/*import { setTodoAttachmentUrl } from '../../businessLogic/todos'*/

const logger = createLogger('generateUploadUrl')
const XAWS = AWSXRay.captureAWS(AWS);
const bucketName = process.env.S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);
let options: AWS.S3.Types.ClientConfiguration = { signatureVersion: 'v4', };

const s3bucket = new XAWS.S3(options);

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing GenerateUploadUrl', event)
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  /*const todoId = event.pathParameters.todoId;*/
  /*
  const todoId = event.pathParameters.todoId;
  
  setTodoAttachmentUrl(
    todoId,
    `https://${bucketName}.s3.amazonaws.com/${todoId}.png`,
  );
*/
  const todoId = event.pathParameters.todoId
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const url = s3bucket.getSignedUrl('putObject', jwtToken, {
    Bucket: bucketName,
    Key: {todoId},
    Expires: urlExpiration,
  });
  
  
/*
 const url = await setTodoAttachmentUrl(todoId,jwtToken)
*/
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      url,
    }),
  };
};
