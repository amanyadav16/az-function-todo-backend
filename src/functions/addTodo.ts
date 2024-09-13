import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { v4 as uuidv4 } from 'uuid';
import { getCosmosClient } from "../services/cosmos-connection.service";

export async function addTodo(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const body = JSON.parse(await request.text());
    const currentTime = new Date().getTime();
    const newTodo = {
        ...body,
        isCompleted: false,
        createdTime: currentTime,
        updatedTime: currentTime,
        todoId: uuidv4()
    };
    try {
        const cosmosClient = getCosmosClient();
        const database = cosmosClient.database('todoDatabase');
        const container = database.container('todoContainer');

        // Insert the new todo item
        const { resource: createdTodo } = await container.items.create(newTodo);

        return { jsonBody: { message: 'Todo created successfully!', data: createdTodo }, status: 201 };
    } catch (error) {
        context.log(`Error while creating todo: ${error}`);
        return { jsonBody: { error: 'Error while creating todo' }, status: 500 };
    }
};

app.http('addTodo', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: addTodo
});
