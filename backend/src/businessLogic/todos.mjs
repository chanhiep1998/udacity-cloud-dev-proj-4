import * as uuid from 'uuid'

import { TodosAccess } from '../dataLayer/todosAccess.mjs'

const todoAccess = new TodosAccess()

export const getAllTodos = async userId => await todoAccess.getAllTodos(userId)


export const createTodo = async (createTodoRequest, userId) => {
    const todoId = uuid.v4()
    const bucketName = process.env.TODOS_S3_BUCKET

    return await todoAccess.createTodo({
        todoId,
        userId,
        name: createTodoRequest.name,
        createdAt: new Date().toISOString(),
        dueDate: createTodoRequest.dueDate,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`,
        done: false
    })
}

export const updateTodo = async (updateTodoRequest, todoId, userId) => {
    return await todoAccess.updateTodo({
        todoId,
        userId,
        name: updateTodoRequest.name,
        dueDate: updateTodoRequest.dueDate,
        done: updateTodoRequest.done
    })
}

export const deleteTodo = async (todoId, userId) => {
    return await todoAccess.deleteTodo(todoId, userId)
}
