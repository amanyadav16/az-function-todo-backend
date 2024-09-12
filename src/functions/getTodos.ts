import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getCosmosClient } from "../services/cosmos-connection.service";

export async function getTodos(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const userId = request.query.get('userId') || '';
    console.log(`userId: ${userId}`);
    try {
        const cosmosClient = getCosmosClient();
        const database = cosmosClient.database('todoDatabase');
        const container = database.container('todoContainer');

        const { resources: todos } = await container.items
        .query(`SELECT * FROM c WHERE c.userId = "${userId}"`)
        .fetchAll();

        return { jsonBody: {message:'todos fetched successfully!', data: todos}, status: 200 };
    } catch (error) {
        context.log(`Error while fetching todos: ${error}`);
        return { jsonBody: { error: 'Eror while fetching todos' }, status: 500 };
    }
};

app.http('getTodos', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getTodos
});
