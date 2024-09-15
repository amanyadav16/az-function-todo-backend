import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getContainer} from "../services/cosmos-connection.service";

export async function getTodos(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
   
    try {
        const container = getContainer('demoDB', 'todoContainer');

        const { resources: todos } = await container.items
        .query(`SELECT * FROM c`)
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
