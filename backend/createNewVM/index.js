import { EC2Client, RunInstancesCommand } from "@aws-sdk/client-ec2";

// Environment variables
const AMI = process.env.AMI;
const INSTANCE_TYPE = process.env.INSTANCE_TYPE;
const KEY_NAME = process.env.KEY_NAME;
const SUBNET_ID = process.env.SUBNET_ID;
const REGION = process.env.REGION;
const S3_BUCKET = process.env.S3_BUCKET;
const DDB_TABLE = process.env.DDB_TABLE;
const IAM_INSTANCE_PROFILE = "EC2S3DynamoDBProfile"; // Name of the instance profile

const ec2Client = new EC2Client({ region: REGION });

export const handler = async (event) => {
  console.log(JSON.stringify(event, null, 2), "Received event");

  // Process only the latest INSERT event
  const record = event.Records.find(record => record.eventName === 'INSERT');

  if (record) {
    const newImage = record.dynamodb.NewImage;
    const itemId = newImage.id.S;

    console.log(itemId, "Processing item ID");

    // UserData script to download and run the process_file.sh script
    const userDataScript = `#!/bin/bash
    yum update -y
    yum install -y aws-cli jq
    aws s3 cp s3://${S3_BUCKET}/process_file.sh /home/ec2-user/process_file.sh
    chmod +x /home/ec2-user/process_file.sh
    /home/ec2-user/process_file.sh ${itemId} ${S3_BUCKET} ${DDB_TABLE} > /var/log/process_file.log 2>&1
    shutdown -h now`;

    const params = {
      ImageId: AMI,
      InstanceType: INSTANCE_TYPE,
      KeyName: KEY_NAME,
      SubnetId: SUBNET_ID,
      MaxCount: 1,
      MinCount: 1,
      InstanceInitiatedShutdownBehavior: 'terminate',
      IamInstanceProfile: {
        Name: IAM_INSTANCE_PROFILE
      },
      UserData: Buffer.from(userDataScript).toString('base64') // Encode the script in base64
    };

    try {
      const data = await ec2Client.send(new RunInstancesCommand(params));
      const instanceId = data.Instances[0].InstanceId;
      console.log(`Instance ${instanceId} launched successfully.`);
      return {
        statusCode: 200,
        body: JSON.stringify({ instanceId }),
      };
    } catch (err) {
      console.error(`Failed to launch instance for item ${itemId}: ${err.message}`);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: `Failed to launch instance: ${err.message}` }),
      };
    }
  } else {
    console.log("No INSERT event found in the records.");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No INSERT event found in the records." }),
    };
  }
};