import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { createTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const createTodoRequest: CreateTodoRequest = JSON.parse(event.body)

    const createdTodo = createTodo({
      createTodoRequest,
      userId
    })

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: createdTodo
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
