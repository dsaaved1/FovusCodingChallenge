#!/bin/bash
# This script is intended to run as user data when launching an EC2 instance

# Variables passed as arguments
ITEM_ID=$1
S3_BUCKET=$2
DDB_TABLE=$3


yum update -y
yum install -y aws-cli jq

# Fetch input details from DynamoDB
ITEM=$(aws dynamodb get-item --table-name ${DDB_TABLE} --key '{"id": {"S": "'${ITEM_ID}'"}}')
INPUT_FILE_PATH=$(echo $ITEM | jq -r '.Item.input_file_path.S')
INPUT_TEXT=$(echo $ITEM | jq -r '.Item.input_text.S')


# Directory to store the input and output files
mkdir -p /home/ec2-user/files


# Download the input file from S3
aws s3 cp s3://${INPUT_FILE_PATH} /home/ec2-user/files/input_file || { echo "Failed to download input file"; exit 1; }

# Process the file: count the length of the input text and append it to the file
FILE_CONTENT=$(cat /home/ec2-user/files/input_file)
INPUT_TEXT_LENGTH=${#INPUT_TEXT}
OUTPUT_CONTENT="${FILE_CONTENT}: ${INPUT_TEXT_LENGTH}"

# Generate a new output file name
BASENAME=$(basename ${INPUT_FILE_PATH} .jpg)
OUTPUT_FILE_NAME="${BASENAME}_with_${INPUT_TEXT_LENGTH}_length.txt"
OUTPUT_FILE_PATH="${OUTPUT_FILE_NAME}"

echo "${OUTPUT_CONTENT}" > /home/ec2-user/${OUTPUT_FILE_PATH}


# Upload the output file to S3
aws s3 cp /home/ec2-user/${OUTPUT_FILE_PATH} s3://${S3_BUCKET}/${OUTPUT_FILE_PATH} || { echo "Failed to upload output file"; exit 1; }

NEW_ITEM_ID=$(uuidgen)
# Update DynamoDB with the new output file path
aws dynamodb put-item \
    --table-name ${DDB_TABLE} \
    --item '{"id": {"S": "'${NEW_ITEM_ID}'"}, "output_file_path": {"S": "'${S3_BUCKET}/${OUTPUT_FILE_PATH}'"}}' || { echo "Failed to update DynamoDB"; exit 1; }


shutdown -h now
