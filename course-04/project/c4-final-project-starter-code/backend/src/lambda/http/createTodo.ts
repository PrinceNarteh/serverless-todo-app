import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { createTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const userId = getUserId(event)
      const createTodoRequest: CreateTodoRequest = JSON.parse(event.body)

      const createdTodo = await createTodo({
        createTodoRequest,
        userId
      })

      return {
        statusCode: 201,
        body: JSON.stringify({
          item: createdTodo
        })
      }
    } catch (error) {
      return {
        statusCode: error?.statusCode || 400,

        body: JSON.stringify({
          message: error?.message || 'error while trying to get create todo'
        })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
