import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

// Initialize DynamoDB document client
const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// Lambda function handler
export const handler = async (event) => {
  try {
        const { input_text, input_file_path } = JSON.parse(event.body);   
        // Create a new item with a unique ID (randomUUID is built-in node.js so we don't need to download module package)
        const newItem = {
            id: randomUUID(),
            input_text: input_text,
            input_file_path: input_file_path
        };

        // Save the new item to the DynamoDB table
        await ddbDocClient.send(new PutCommand({
            TableName: "FileTable",
            Item: newItem,
        }));

        // Return a successful response with the new item
        return {
            statusCode: 201,
            body: JSON.stringify(newItem),
        };
    }
    catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
};
