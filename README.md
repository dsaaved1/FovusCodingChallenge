# Project Deployment and Testing Guide

This README file provides a comprehensive guide on how to deploy and test the project, which consists of a frontend and three backend AWS Lambda functions. The backend also includes an S3 bucket for file uploads and a DynamoDB table. The frontend allows users to upload images and input text, which are then processed by the backend.

## Prerequisites

- Node.js and npm installed.
- An AWS account with access to S3, DynamoDB, and Lambda services.

## Step-by-Step Guide

### 1. Upload S3 files directly from Web

1. **Deploy the S3 Uploader**
- Use your local terminal to deploy the S3 Uploader. This will create a preSignedURL endpoint, allowing you to upload files directly to an S3 bucket. Follow the steps in the guide linked below:

[AWS Blog: Uploading to Amazon S3 Directly from a Web or Mobile Application](https://aws.amazon.com/blogs/compute/uploading-to-amazon-s3-directly-from-a-web-or-mobile-application/)

2. **Paste API Endpoint to App.js**:
- In `frontend/src/App.js` paste the API endpoint given by the previous step to `API_ENDPOINT`.

3. **Check Changes in AWS**:

- After deploying with AWS SAM, you will have a new S3 bucket named `s3uploader` along with a Lambda function in your AWS account.
- You can also create these resources manually, including an IAM role with the necessary permissions.

4. **Create and Upload a Zip File for Lambda**
- The Lambda function in AWS, which is not passed the contents of the uploaded file as specified in the requirements, is initially written in SDK v2. To change it to SDK v3, navigate to the `backend/s3Uploader` directory, which contains the updated code in SDK v3.
- Create the necessary zip file and upload it to AWS in the Lambda function. t doesn't have to be the same name as the Lambda function.

   
### 2. Save input in DynamoDB Table

1. **Create DynamoDB Table**:
- Create a DynamoDB table and then set up a Lambda function with the appropriate IAM role permissions.
- Configure an API Gateway as a trigger for this Lambda function. Update the `API_SAVE_ENDPOINT` variable in `frontend/src/App.js` with the API Gateway endpoint.

2. **Update SaveUploadDataFunction Lambda Code**
- In the AWS Management Console, locate the Lambda function you created for saving data to DynamoDB. Replace the existing `index.mjs` file with the `index.js` file found in the `backend/saveUploadDataFunction` directory. 

### 3. Run Script in a VM Instance

1. **Configure the Lambda Function and DynamoDB Streams**:
- Create the Lambda Function: Set up a new Lambda function with the necessary IAM role permissions to launch EC2 instances, read/write to S3, and access DynamoDB.
- Enable DynamoDB Streams: In your DynamoDB table, enable streams with the "New and old images" view type.
- Create a Trigger: Configure the DynamoDB stream to trigger the createNewVM Lambda function whenever a new file is uploaded to the table. This Lambda function will automatically launch a new EC2 instance.

2. **Set Up EC2 IAM Instance Profile**:
- Create an Instance Profile: In the IAM console, create an instance profile that allows the EC2 instance to upload files to the S3 bucket and update the DynamoDB table.

3. **Update the create_new_VM Lambda Code**
- Update Lambda Function: In the AWS Management Console, locate the Lambda function responsible for launching the EC2 instance. Replace the existing `index.mjs` file with the `index.js` file found in the `backend/createNewVM directory`.
- Set Environment Variables: Add the following environment variables to the Lambda function configuration:
  - AMI
  - INSTANCE_TYPE
  - KEY_NAME
  - SUBNET_ID
  - REGION
  - S3_BUCKET
  - DDB_TABLE
  - IAM_INSTANCE_PROFILE

4. **Upload the Process Script to S3**:
- Upload process_file.sh: Manually upload the `process_file.sh` script from the `backend/createNewVM` directory to your S3 bucket. This script will be downloaded and executed by the EC2 instance.

### 4. Setup the Frontend

1. **Navigate to the frontend directory**:
    ```bash
    cd ../frontend
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Run the frontend**:
    ```bash
    npm start
    ```

### 5. Test the Application

1. **Open the frontend**:
    - Access the frontend in your browser (usually `http://localhost:3000`).

2. **Upload a file and input text**:
    - Use the interface to select a JPG file and enter some text.
    - Click Submit.

3. **Verify the process**:
    - Ensure the file is uploaded to the S3 bucket.
    - Verify that the input data is saved to DynamoDB.
    - Confirm that the EC2 instance is launched, processes the file, and uploads the output file to the S3 bucket.
    - Check that the new item with the output file path is added to the DynamoDB table.


## Thank You!

Thank you for using this project! If you have any questions or encounter any problems, please feel free to write me an email at [diegoas2@illinois.edu](mailto:diegoas2@illinois.edu).

Diego Saavedra

