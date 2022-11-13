import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly indexTodos = process.env.TODOS_CREATED_AT_INDEX
  ) {}

  createTodo = async (todoItem: TodoItem): Promise<TodoItem> => {
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todoItem
      })
      .promise()

    return todoItem as TodoItem
  }

  //get all todos by todoID
  async getTodoById(todoId: string): Promise<TodoItem> {
    const output = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.indexTodos,
        KeyConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues: {
          ':todoId': todoId
        }
      })
      .promise()
    const item = output.Items
    const result = item.length !== 0 ? (item[0] as TodoItem) : null
    return result
  }

  async getAllTodosByUser(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos')

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: '#userId = :userId',
        ExpressionAttributeNames: {
          '#userId': 'userId'
        },
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async updateTodo({
    todoId,
    updateTodoRequest,
    userId
  }: {
    updateTodoRequest: TodoUpdate
    todoId: string
    userId: string
  }): Promise<TodoUpdate> {
    const res = await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        },
        UpdateExpression:
          'set #name = :name, #dueDate = :dueDate, #done = :done',
        ExpressionAttributeNames: {
          '#name': 'name',
          '#dueDate': 'dueDate',
          '#done': 'done'
        },
        ExpressionAttributeValues: {
          ':name': updateTodoRequest['name'],
          ':dueDate': updateTodoRequest['dueDate'],
          ':done': updateTodoRequest['done']
        },
        ReturnValues: 'ALL_NEW'
      })
      .promise()

    const attributes = res.Attributes
    return attributes as TodoUpdate
  }

  async deleteTodo({
    todoId,
    userId
  }: {
    todoId: string
    userId: string
  }): Promise<string> {
    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId
        }
      })
      .promise()

    return '' as string
  }

  async addAttachment(todo: TodoItem): Promise<TodoItem> {
    const result = await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          userId: todo.userId,
          todoId: todo.todoId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': todo.attachmentUrl
        }
      })
      .promise()

    return result.Attributes as TodoItem
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    AWSXRay.setContextMissingStrategy('LOG_ERROR')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
