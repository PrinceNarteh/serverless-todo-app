import * as AWS from 'aws-sdk'
import { Types } from 'aws-sdk/clients/s3'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.GROUPS_TABLE
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
    todoUpdate,
    userId
  }: {
    todoUpdate: TodoUpdate
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
          ':name': todoUpdate['name'],
          ':dueDate': todoUpdate['dueDate'],
          ':done': todoUpdate['done']
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

  async generateUploadURL(todoId: string): Promise<string> {
    const s3BucketName = process.env.S3_BUCKET_NAME
    const s3Client: Types = new AWS.S3({ signatureVersion: 'v4' })

    const url = s3Client.getSignedUrl('putObject', {
      Bucket: s3BucketName,
      Key: todoId,
      Expires: 1000
    })

    return url as string
  }
}
