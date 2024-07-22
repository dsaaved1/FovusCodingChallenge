# Project Deployment and Testing Guide

This README file provides a comprehensive guide on how to deploy and test the project, which consists of a frontend and three backend AWS Lambda functions. The backend also includes an S3 bucket for file uploads and a DynamoDB table. The frontend allows users to upload images and input text, which are then processed by the backend.

## Prerequisites

- Node.js and npm installed.
- An AWS account with access to S3, DynamoDB, and Lambda services.

## Step-by-Step Guide

### 1. Upload S3 files directly from Web

1. **Deploy the S3 Uploader**
Use your local terminal to deploy the S3 Uploader. This will create a preSignedURL endpoint, allowing you to upload files directly to an S3 bucket. Follow the steps in the guide linked below:

https://aws.amazon.com/blogs/compute/uploading-to-amazon-s3-directly-from-a-web-or-mobile-application/

2. ** Check Changes in AWS**:

After deploying with AWS SAM, you will have a new S3 bucket named `s3uploader` along with a Lambda function in your AWS account. You can also create these resources manually, including an IAM role with the necessary permissions.

3**Create and Upload a Zip File for Lambda**
The Lambda function in AWS, which is not passed the contents of the uploaded file as specified in the requirements, is initially written in SDK v2. To change it to SDK v3, navigate to the `backend/s3Uploader` directory, which contains the updated code in SDK v3. Create the necessary zip file and upload it to AWS in the Lambda function. t doesn't have to be the same name as the Lambda function.

   
### 2. Setup and Deploy the Save Inputs to DynamoDB

1. **Navigate to the `s3Uploader` directory**:
   ```bash
   cd backend/s3Uploader

### 3. Setup and Deploy the Create New VM

1. **Navigate to the `s3Uploader` directory**:
   ```bash
   cd backend/s3Uploader

### 4. Setup the Frontend

1. **Navigate to the `s3Uploader` directory**:
   ```bash
   cd backend/s3Uploader

### 5. Test the Application

1. **Navigate to the `s3Uploader` directory**:
   ```bash
   cd backend/s3Uploader

