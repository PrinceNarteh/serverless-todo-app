import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate'

const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')

    return new XAWS.DynamoDB({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB()
}

export class TodosAccess {
  constructor(
    private readonly todosTable = process.env.GROUPS_TABLE,
    private readonly docClient: DocumentClient = createDynamoDBClient()
  ) {}

  createTodo = async (todo: TodoItem): Promise<TodoItem> => {
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todo
      })
      .promise()

    return todo
  }

  async getAllTodosByUser(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos')

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async getTodoById(todoId: string): Promise<TodoItem> {
    const result = await this.docClient.query({
      TableName: this.todosTable
    })
    return result.
  }
}
