#--------------------------------------------------------------------
# AWS s3 bucket for terraform state
#--------------------------------------------------------------------
resource "aws_s3_bucket" "s3_terraform_state_bucket" {
  bucket        = local.s3_terraform_state_bucket_name
  force_destroy = true
  tags = merge(local.tags, {
    resource_name = local.s3_terraform_state_bucket_name
  })
}

#--------------------------------------------------------------------
# AWS s3 bucket versioning
#--------------------------------------------------------------------
resource "aws_s3_bucket_versioning" "s3_terraform_state_bucket_versioning" {
  bucket = aws_s3_bucket.s3_terraform_state_bucket.id

  versioning_configuration {
    status = "Enabled"
  }

}

#--------------------------------------------------------------------
# AWS s3 bucket block public access
#--------------------------------------------------------------------
resource "aws_s3_bucket_public_access_block" "s3_terraform_state_bucket_pab" {
  bucket                  = aws_s3_bucket.s3_terraform_state_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

#--------------------------------------------------------------------
# AWS s3 bucket lifecycle configuration to keep only last 3 versions of objects
#--------------------------------------------------------------------
resource "aws_s3_bucket_lifecycle_configuration" "keep_last_3_versions" {
  bucket = aws_s3_bucket.s3_terraform_state_bucket.id

  rule {
    id     = "keep-only-last-3-versions"
    status = "Enabled"

    filter {}

    noncurrent_version_expiration {
      # Keep only 2 non-current versions
      # (1 current + 2 non-current = 3 total)
      newer_noncurrent_versions = 2
      noncurrent_days           = 1
    }
  }
}

