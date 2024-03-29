import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logger.mjs'
import { AttachmentUtils } from '../../fileStorage/attachmentUtils.mjs'

const attachmentUtils = new AttachmentUtils()
const logger = createLogger('generateUploadUrl')

export const handler = middy()
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
    .handler(async (event) => {
        logger.info('Processing event: ', event)

        const todoId = event.pathParameters.todoId

        const uploadUrl = await attachmentUtils.generateUploadUrl(todoId)

        return {
            statusCode: 201,
            body: JSON.stringify({
                uploadUrl
            })
        }
    })

