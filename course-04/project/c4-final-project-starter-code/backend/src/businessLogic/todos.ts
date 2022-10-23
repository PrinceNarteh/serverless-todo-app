import { TodosAccess } from '../dataLayer/todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
// import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import { v4 as uuid } from 'uuid'

const todosAccess = new TodosAccess()

export const createTodo = async (
  todoRequest: CreateTodoRequest,
  userId: string
) => {
  const todoId = uuid()
  const createdAt = new Date().toISOString()

  return todosAccess.createTodo({
    userId,
    todoId,
    createdAt,
    ...todoRequest,
    done: false,
    attachmentUrl: ''
  })
}

export const getTodosForUser = (userId: string) => {
  return todosAccess.getAllTodosByUser(userId)
}
