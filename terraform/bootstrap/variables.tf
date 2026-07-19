#--------------------------------------------------------------------
# Prefixes
#--------------------------------------------------------------------
locals {
  env_level_unique_prefix     = var.product_name
  account_level_unique_prefix = "${var.product_name}-${var.aws_region}"
  globally_unique_prefix      = "${var.product_name}-${var.aws_region}-${var.aws_account_id}"
}

#--------------------------------------------------------------------
# Derived variables
#--------------------------------------------------------------------
locals {
  s3_terraform_state_bucket_name = "${local.globally_unique_prefix}-terraform-bucket"
  dynamo_table_name              = "${local.globally_unique_prefix}-terraform-lock-table"
}

#--------------------------------------------------------------------
# Tags
#--------------------------------------------------------------------
locals {
  tags = {
    product_name = var.product_name
    region       = var.aws_region
    managed_by   = "terraform"
  }
}

#--------------------------------------------------------------------
# Config variables
#--------------------------------------------------------------------
variable "aws_account_id" {
  description = "The 12-digit AWS account ID designated for DevOps operations."
  type        = string

  validation {
    condition     = length(var.aws_account_id) == 12 && can(regex("^[0-9]{12}$", var.aws_account_id))
    error_message = "The AWS Account ID must be exactly 12 digits."
  }
}

variable "aws_region" {
  description = "The AWS geographic region where resources will be provisioned."
  type        = string
}

variable "product_name" {
  description = "The identifier for the application or system. Must contain only lowercase letters, numbers, and hyphens."
  type        = string
}
