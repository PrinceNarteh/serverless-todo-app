import * as AWS from 'aws-sdk'
import {Types} from "aws-sdk/clients/s3" 
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'


export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly s3Bucket = process.env.S3_BUCKET_NAME,
    private readonly s3Client: Types = new AWS.S3({signatureVersion: 'v4'}),
    private readonly todosTable = process.env.GROUPS_TABLE,
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