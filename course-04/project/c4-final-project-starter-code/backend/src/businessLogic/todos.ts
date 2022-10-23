import { v4 as uuid } from 'uuid'
import { parseUserId } from '../auth/utils'
import { TodosAccess } from '../dataLayer/todosAccess'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todosAccess = new TodosAccess()

export const createTodo = async (
  todoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> => {
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

export const getTodosForUser = (jwtToken: string): Promise<TodoItem[]> => {
  const userId = parseUserId(jwtToken)
  return todosAccess.getAllTodosByUser(userId)
}

export const updateTodo = (
  todoUpdateRequest: UpdateTodoRequest,
  todoId: string,
  jwtToken: string
): Promise<TodoUpdate> => {
  const userId = parseUserId(jwtToken)
  return todosAccess.updateTodo({ todoId, todoUpdateRequest, userId })
}

export const deleteTodo = (
  todoId: string,
  jwtToken: string
): Promise<string> => {
  const userId = parseUserId(jwtToken)
  return todosAccess.deleteTodo({ todoId, userId })
}

export const generateUploadURL = (todoId: string): Promise<string> => {
  return todosAccess.generateUploadURL(todoId)
}
