# Project Deployment and Testing Guide

This README file provides a comprehensive guide on how to deploy and test the project, which consists of a frontend and three backend AWS Lambda functions. The backend also includes an S3 bucket for file uploads and a DynamoDB table. The frontend allows users to upload images and input text, which are then processed by the backend.

## Prerequisites

- AWS CLI installed and configured with the necessary permissions.
- AWS SAM CLI installed.
- Node.js and npm installed.
- An AWS account with access to S3, DynamoDB, and Lambda services.

## Step-by-Step Guide

### 1. Setup and Deploy the S3 Uploader

1. **Navigate to the `s3Uploader` directory**:
   ```bash
   cd backend/s3Uploader

