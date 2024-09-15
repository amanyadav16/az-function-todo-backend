import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getContainer} from "../services/cosmos-connection.service";

export async function updateTodo(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const body = JSON.parse(await request.text());
    console.log({body})
    const id = body['id'];
    const isCompleted = body['isCompleted'];

    try {
        const container = getContainer('demoDB', 'todoContainer');

        const { resource: todo } = await container.item(id,id).read();

        if (!todo) {
            return { jsonBody: { error: 'Todo item not found' }, status: 404 };
        }

        todo.isCompleted = isCompleted;
        todo.updatedTime = new Date().getTime();

        const { resource: updatedTodo } = await container.item(id,id).replace(todo);

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
