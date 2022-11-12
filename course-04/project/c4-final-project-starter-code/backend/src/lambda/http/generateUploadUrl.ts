import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { uploadURL } from '../../storageLayer/generateUploadURL'
import { getTodoById, addAttachment } from '../../businessLogic/todos'

const bucket_Name = process.env.S3_BUCKET_NAME

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const todosId = event.pathParameters.todoId
      // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
      const todos = await getTodoById(todosId)
      todos.attachmentUrl = `https://${bucket_Name}.s3.amazonaws.com/${todosId}`
      await addAttachment(todos)

      const url = await uploadURL(todosId)

      return {
        statusCode: 201,

        body: JSON.stringify({
          uploadUrl: url
        })
      }
    } catch (error) {
      return {
        statusCode: error?.statusCode || 400,

        body: JSON.stringify({
          message: error?.message || 'error while trying to get url'
        })
      }
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
