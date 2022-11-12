import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const todoId = event.pathParameters.todoId
      const userId = getUserId(event)

      const deletedData = await deleteTodo({
        todoId,
        userId
      })

      return {
        statusCode: 200,
        body: deletedData
      }
    } catch (error) {
      return {
        statusCode: error?.statusCode || 400,

        body: JSON.stringify({
          message: error?.message || 'error while trying to delete todo'
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
