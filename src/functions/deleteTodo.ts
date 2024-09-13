import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getCosmosClient } from "../services/cosmos-connection.service";

export async function deleteTodo(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    // Extract the necessary fields from the request
    const id = request.query.get('id') || '';
    const todoId = request.query.get('todoId') || '';

    console.log(`id: ${id}, todoId: ${todoId}`);

    try {
        const cosmosClient = getCosmosClient();
        const database = cosmosClient.database('todoDatabase');
        const container = database.container('todoContainer');

        // Delete the todo item
        await container.item(id, todoId).delete();

        return { jsonBody: { message: 'Todo deleted successfully!' }, status: 200 };
    } catch (error) {
        context.log(`Error while deleting todo: ${error}`);
        return { jsonBody: { error: 'Error while deleting todo' }, status: 500 };
    }
};

app.http('deleteTodo', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    handler: deleteTodo
});
