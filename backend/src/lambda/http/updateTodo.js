import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { updateTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('updateTodo')

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
        const updatedTodo = JSON.parse(event.body)

        const userId = getUserId(event)

        const result = await updateTodo(updatedTodo, todoId, userId)
        logger.info("Done updated", result)

        return {
            statusCode: 204,
        }
    })