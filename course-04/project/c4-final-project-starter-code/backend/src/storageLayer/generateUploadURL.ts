import * as AWS from 'aws-sdk'
import { Types } from 'aws-sdk/clients/s3'

export async function uploadURL(todoId: string): Promise<string> {
  const s3BucketName = process.env.S3_BUCKET_NAME
  const s3Client: Types = new AWS.S3({ signatureVersion: 'v4' })

  const url = s3Client.getSignedUrl('putObject', {
    Bucket: s3BucketName,
    Key: todoId,
    Expires: 300
  })

  return url as string
}
