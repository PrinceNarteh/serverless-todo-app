import { v4 as uuid } from 'uuid'
import { TodosAccess } from '../dataLayer/todosAccess'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todosAccess = new TodosAccess()

export const createTodo = async ({
  createTodoRequest,
  userId
}: {
  createTodoRequest: CreateTodoRequest
  userId: string
}): Promise<TodoItem> => {
  const todoId = uuid()
  const s3Bucket = process.env.S3_BUCKET_NAME
  const createdAt = new Date().toISOString()

  return todosAccess.createTodo({
    userId,
    todoId,
    createdAt,
    ...createTodoRequest,
    done: false,
    attachmentUrl: `https://${s3Bucket}.s3.amazonaws.com/${todoId}`
  })
}

export const getTodosForUser = (userId: string): Promise<TodoItem[]> => {
  return todosAccess.getAllTodosByUser(userId)
}

export const updateTodo = ({
  todoId,
  updateTodoRequest,
  userId
}: {
  updateTodoRequest: UpdateTodoRequest
  todoId: string
  userId: string
}): Promise<TodoUpdate> => {
  return todosAccess.updateTodo({ todoId, updateTodoRequest, userId })
}

export const deleteTodo = ({
  todoId,
  userId
}: {
  todoId: string
  userId: string
}): Promise<string> => {
  return todosAccess.deleteTodo({ todoId, userId })
}

export const generateUploadURL = (todoId: string): Promise<string> => {
  return todosAccess.generateUploadURL(todoId)
}
