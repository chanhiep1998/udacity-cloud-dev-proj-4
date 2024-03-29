import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('attachmentUtils')

export class AttachmentUtils {
    constructor(
        s3Client = new S3Client(),
        bucketName = process.env.TODOS_S3_BUCKET,
        urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) {
        this.s3Client = s3Client
        this.bucketName = bucketName
        this.urlExpiration = urlExpiration
    }

    async generateUploadUrl(todoId) {
        logger.info(`Generating upload url for todo with id ${todoId}`)
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: todoId
        })
        const url = await getSignedUrl(this.s3Client, command, {
            expiresIn: this.urlExpiration
        })
        return url
    }
}