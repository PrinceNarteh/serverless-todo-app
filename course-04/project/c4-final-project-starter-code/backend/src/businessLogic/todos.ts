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
  if (!createTodoRequest.name) return null

  const todoId = uuid()
  const createdAt = new Date().toISOString()

  return todosAccess.createTodo({
    userId,
    todoId,
    createdAt,
    done: false,
    attachmentUrl: '',
    ...createTodoRequest
  })
}

export const getTodosForUser = async (userId: string): Promise<TodoItem[]> => {
  return todosAccess.getAllTodosByUser(userId)
}

export const updateTodo = async ({
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

export const deleteTodo = async ({
  todoId,
  userId
}: {
  todoId: string
  userId: string
}): Promise<string> => {
  return todosAccess.deleteTodo({ todoId, userId })
}

export async function getTodoById(todoId: string) {
  return todosAccess.getTodoById(todoId)
}

export async function addAttachment(todo: TodoItem): Promise<TodoItem> {
  return await todosAccess.addAttachment(todo)
}
