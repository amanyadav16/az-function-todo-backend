import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getCosmosClient } from "../services/cosmos-connection.service";

export async function updateTodo(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
   // console.log('**************', );
    const body = JSON.parse(await request.text());
    const id = body['id'] || '';
    const userId = body['userId'] || '';
    const todoId = body['todoId'] || '';
    const isCompleted = body['isCompleted'] || false;

    console.log(`userId: ${userId}, todoId: ${todoId}`);

    try {
        const cosmosClient = getCosmosClient();
        const database = cosmosClient.database('todoDatabase');
        const container = database.container('todoContainer');

        // Fetch the todo item
        const { resource: todo } = await container.item(id, todoId).read();

        if (!todo) {
            return { jsonBody: { error: 'Todo item not found' }, status: 404 };
        }

        // Update the isCompleted property
        todo.isCompleted = isCompleted;
        todo.updatedTime = new Date().getTime();

        // Save the updated item back to the Cosmos DB
        const { resource: updatedTodo } = await container.item(id, todoId).replace(todo);

        return { jsonBody: { message: 'Todo updated successfully!', data: updatedTodo }, status: 200 };
    } catch (error) {
        context.log(`Error while updating todo: ${error}`);
        return { jsonBody: { error: 'Error while updating todo' }, status: 500 };
    }
};

app.http('updateTodo', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: updateTodo
});
