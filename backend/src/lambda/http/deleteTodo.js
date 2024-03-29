import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { deleteTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { AttachmentUtils } from '../../fileStorage/attachmentUtils.mjs'

const attachmentUtils = new AttachmentUtils()

const logger = createLogger('deleteTodo')

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

        const userId = getUserId(event)

        const deleted = await deleteTodo(todoId, userId)

        const isDeletedObject = await attachmentUtils.deleteObject(todoId)

        logger.info("Done deleted", deleted)
        logger.info("isDeletedObject", isDeletedObject)

        return {
            statusCode: 204
        }
    })
