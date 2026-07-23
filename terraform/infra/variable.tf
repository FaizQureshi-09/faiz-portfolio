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
# Derived variables
#--------------------------------------------------------------------
locals {
  lambda_function_name         = "${local.env_level_unique_prefix}-email-sending-lambda"
  lambda_role_name             = "${local.lambda_function_name}-role"
  lambda_log_group_name        = "/aws/lambda/${local.lambda_function_name}"
  api_gateway_name             = "${local.env_level_unique_prefix}-website-api"
  smtp_password_parameter_name = "/${local.env_level_unique_prefix}/email-sender/smtp-password"

}

#--------------------------------------------------------------------
# Prefix variables
#--------------------------------------------------------------------
locals {
  env_level_unique_prefix     = var.product_name
  account_level_unique_prefix = "${var.product_name}-${var.aws_region}"
  globally_unique_prefix      = "${var.product_name}-${var.aws_region}-${var.aws_account_id}"
}

#--------------------------------------------------------------------
# Config variables
#--------------------------------------------------------------------
variable "aws_account_id" {
  description = "Account id of the aws account"
  type        = string
}

variable "aws_region" {
  description = "AWS account region"
  type        = string
}

variable "product_name" {
  description = "The product line for which this infrastructure is created."
  type        = string
}

#--------------------------------------------------------------------
# Email sender Lambda - runtime configuration
#--------------------------------------------------------------------
variable "lambda_runtime" {
  description = "Lambda runtime identifier for the email sender function."
  type        = string
  default     = "python3.12"
}

variable "lambda_timeout" {
  description = "Timeout (in seconds) for the email sender Lambda function."
  type        = number
  default     = 10
}

variable "lambda_memory_size" {
  description = "Memory (in MB) allocated to the email sender Lambda function."
  type        = number
  default     = 128
}

variable "lambda_log_retention_in_days" {
  description = "Number of days to retain the email sender Lambda's CloudWatch log group."
  type        = number
  default     = 14
}

#--------------------------------------------------------------------
# Email sender Lambda - environment variables
#--------------------------------------------------------------------
variable "contact_form_from_email" {
  description = "Verified sender address used in the contact form email's From header. Passed to the Lambda as FROM_EMAIL."
  type        = string
}

variable "contact_form_to_email" {
  description = "Inbox that receives contact form submissions. Passed to the Lambda as TO_EMAIL."
  type        = string
}

variable "smtp_host" {
  description = "SMTP server hostname used to send contact form emails. Passed to the Lambda as SMTP_HOST."
  type        = string
}

variable "smtp_port" {
  description = "SMTP server port used to send contact form emails. Passed to the Lambda as SMTP_PORT."
  type        = number
  default     = 587
}

variable "smtp_user" {
  description = "SMTP authentication username. Passed to the Lambda as SMTP_USER."
  type        = string
}

variable "cors_allow_origin" {
  description = "Value returned in the Access-Control-Allow-Origin header. Passed to the Lambda as CORS_ALLOW_ORIGIN and configured as the API Gateway's allowed CORS origin."
  type        = string
  default     = "*"
}

#--------------------------------------------------------------------
# API Gateway - contact form route
#--------------------------------------------------------------------
variable "contact_form_route_path" {
  description = "API Gateway route path that triggers the contact form Lambda, e.g. /contact."
  type        = string
  default     = "/contact"
}

variable "api_gateway_stage_name" {
  description = "Name of the API Gateway deployment stage (environment), e.g. dev, staging, prod."
  type        = string
  default     = "dev"
}

#--------------------------------------------------------------------
# SSM variables
#--------------------------------------------------------------------
variable "smtp_password" {
  description = "SMTP authentication password, stored as a SecureString in SSM Parameter Store and read by the Lambda at runtime. Provide this via a gitignored *.auto.tfvars file or TF_VAR_smtp_password, never commit it in env.tfvars."
  type        = string
  sensitive   = true
}
