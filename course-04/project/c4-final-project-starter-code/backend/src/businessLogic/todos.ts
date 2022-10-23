import { TodosAccess } from '../dataLayer/todosAccess'
// import { AttachmentUtils } from './attachmentUtils';
// import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import { v4 as uuid } from 'uuid'
import { parseUserId } from '../auth/utils'

const todosAccess = new TodosAccess()

export const createTodo = async (
  todoRequest: CreateTodoRequest,
  jwtToken: string
) => {
  const todoId = uuid()
  const userId = parseUserId(jwtToken)
  const s3Bucket = process.env.S3_BUCKET_NAME
  const createdAt = new Date().toISOString()

  return todosAccess.createTodo({
    userId,
    todoId,
    createdAt,
    ...todoRequest,
    done: false,
    attachmentUrl: `https://${s3Bucket}.s3.amazonaws.com/${todoId}`
  })
}

export const getTodosForUser = (userId: string) => {
  return todosAccess.getAllTodosByUser(userId)
}
