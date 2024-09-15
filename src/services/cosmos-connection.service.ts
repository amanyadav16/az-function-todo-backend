import { CosmosClient } from "@azure/cosmos";

const getCosmosClient = () => {
    const endpoint = process.env["consmosEndpoint"];
    const key = process.env["connectionKey"];
    return new CosmosClient({ endpoint, key });
}

const getDatabase = (databaseId: string) => {
    return getCosmosClient().database(databaseId);
}

export const getContainer = (databaseId: any, containerId: string) => {
    return getDatabase(databaseId).container(containerId);
}