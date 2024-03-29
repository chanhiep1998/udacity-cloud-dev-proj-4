import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('todoAccess')
export class TodosAccess {
    constructor(
        documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
        todosTable = process.env.TODOS_TABLE,
        todoCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX
    ) {
        this.documentClient = documentClient
        this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
        this.todosTable = todosTable
        this.todoCreatedAtIndex = todoCreatedAtIndex
    }

    async getAllTodos(userId) {
        logger.info(`Getting all todos for user with id ${userId}`)

        const result = await this.dynamoDbClient.query({
            TableName: this.todosTable,
            IndexName: this.todoCreatedAtIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        })
        return result.Items
    }

    async createTodo(todo) {
        logger.info(`Creating a todo with id ${todo.todoId} for user with id ${todo.userId}`)

        await this.dynamoDbClient.put({
            TableName: this.todosTable,
            Item: todo
        })

        return todo
    }

    async updateTodo(todo) {
        logger.info(`Updating a todo with id ${todo.todoId} for user with id ${todo.userId}`)
        const updated = await this.dynamoDbClient.update({
            TableName: this.todosTable,
            Key: {
                todoId: todo.todoId,
                userId: todo.userId
            },
            UpdateExpression: 'set #namae = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': todo.name,
                ':dueDate': todo.dueDate,
                ':done': todo.done
            },
            ExpressionAttributeNames: {
                "#namae": "name"
            }
        })
        logger.info("Updated", updated)
        return updated
    }

    async deleteTodo(todoId, userId) {
        logger.info(`Deleting a todo with id ${todoId} for user with id ${userId}`)
        const deleted = await this.dynamoDbClient.delete({
            TableName: this.todosTable,
            Key: { todoId, userId }
        })
        logger.info("Deleted", deleted)
        return deleted
    }
}