import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getContainer} from "../services/cosmos-connection.service";

export async function deleteTodo(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const id = request.query.get('id');

    console.log(`id: ${id}`);

    try {
        const container = getContainer('demoDB', 'todoContainer');

        await container.item(id,id).delete();

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
