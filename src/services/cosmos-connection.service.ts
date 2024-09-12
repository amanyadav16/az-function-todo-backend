import { CosmosClient } from "@azure/cosmos";

export const getCosmosClient = () => {
    const endpoint = process.env["consmosEndpoint"];
    const key = process.env["connectionKey"];
    return new CosmosClient({ endpoint, key });
}