import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { deleteTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

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

        logger.info("Done deleted", deleted)
        return {
            statusCode: 204
        }
    })