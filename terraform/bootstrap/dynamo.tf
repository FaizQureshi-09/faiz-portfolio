#--------------------------------------------------------------------
# AWS DynamoDB Table for Terraform State Locking
#--------------------------------------------------------------------
resource "aws_dynamodb_table" "terraform_locks" {
  name           = local.dynamo_table_name
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 4
  hash_key       = "LockID"

  # Encryption at rest
  server_side_encryption {
    enabled = true
  }

  # Table schema
  attribute {
    name = "LockID"
    type = "S"
  }

  tags = merge(local.tags, {
    resource_name = local.dynamo_table_name
  })
}