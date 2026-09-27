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
  lambda_function_name  = "${local.env_level_unique_prefix}-email-sending-lambda"
  lambda_role_name      = "${local.lambda_function_name}-role"
  lambda_log_group_name = "/aws/lambda/${local.lambda_function_name}"
  api_gateway_name      = "${local.env_level_unique_prefix}-website-api"

  ssm_parameter_prefix             = "/${local.env_level_unique_prefix}/email-sender"
  smtp_password_parameter_name     = "${local.ssm_parameter_prefix}/smtp-password"
  from_email_parameter_name        = "${local.ssm_parameter_prefix}/from-email"
  to_email_parameter_name          = "${local.ssm_parameter_prefix}/to-email"
  smtp_host_parameter_name         = "${local.ssm_parameter_prefix}/smtp-host"
  smtp_port_parameter_name         = "${local.ssm_parameter_prefix}/smtp-port"
  smtp_user_parameter_name         = "${local.ssm_parameter_prefix}/smtp-user"
  cors_allow_origin_parameter_name = "${local.ssm_parameter_prefix}/cors-allow-origin"

  experience_lambda_function_name  = "${local.env_level_unique_prefix}-get-experience-lambda"
  experience_lambda_role_name      = "${local.experience_lambda_function_name}-role"
  experience_lambda_log_group_name = "/aws/lambda/${local.experience_lambda_function_name}"

  experience_ssm_parameter_prefix = "/${local.env_level_unique_prefix}/get-experience"
  start_date_parameter_name       = "${local.experience_ssm_parameter_prefix}/start-date"

  email_sender_api_lambda_function_name  = "${local.env_level_unique_prefix}-email-sender-api-lambda"
  email_sender_api_lambda_role_name      = "${local.email_sender_api_lambda_function_name}-role"
  email_sender_api_lambda_log_group_name = "/aws/lambda/${local.email_sender_api_lambda_function_name}"

  email_sender_api_ssm_parameter_prefix      = "/${local.env_level_unique_prefix}/email-sender-api"
  email_sender_api_from_email_parameter_name = "${local.email_sender_api_ssm_parameter_prefix}/from-email"
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
  default     = 15
}

variable "lambda_memory_size" {
  description = "Memory (in MB) allocated to the email sender Lambda function. AWS Lambda allocates CPU proportionally to memory, and TLS handshakes (SSM + SMTP) are CPU-bound, so low memory throttles them badly — see the perf note in email_sender.py."
  type        = number
  default     = 1024
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
  description = "SMTP server port used to send contact form emails. Passed to the Lambda as SMTP_PORT. Defaults to 465 (implicit TLS) rather than 587 (STARTTLS) — it saves a full EHLO/STARTTLS round trip, which matters for Lambda-latency."
  type        = number
  default     = 465
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
# Get-experience Lambda
#--------------------------------------------------------------------
variable "experience_lambda_memory_size" {
  description = "Memory (in MB) allocated to the get-experience Lambda function. It does no network calls at runtime (env vars only, no SSM/SMTP), so it doesn't need the CPU headroom the email sender does."
  type        = number
  default     = 128
}

variable "experience_lambda_timeout" {
  description = "Timeout (in seconds) for the get-experience Lambda function."
  type        = number
  default     = 5
}

variable "start_date" {
  description = "Career start date used to compute total experience, in dd/mm/yyyy format. Passed to the Lambda as START_DATE via SSM."
  type        = string
}

variable "experience_route_path" {
  description = "API Gateway route path that triggers the get-experience Lambda, e.g. /experience."
  type        = string
  default     = "/experience"
}

#--------------------------------------------------------------------
# Generic email sender API Lambda
#--------------------------------------------------------------------
variable "email_sender_api_from_email" {
  description = "Verified sender address used in the generic email API's From header. Passed to the Lambda as FROM_EMAIL and SMTP_USER."
  type        = string
}

variable "email_sender_api_lambda_memory_size" {
  description = "Memory (in MB) allocated to the generic email sender API Lambda function. TLS handshakes (SSM + SMTP) are CPU-bound, so it shares the email-sender Lambda's memory sizing."
  type        = number
  default     = 1024
}

variable "email_sender_api_lambda_timeout" {
  description = "Timeout (in seconds) for the generic email sender API Lambda function."
  type        = number
  default     = 15
}

variable "email_sender_route_path" {
  description = "API Gateway route path that triggers the generic email sender API Lambda, e.g. /email-sender."
  type        = string
  default     = "/email-sender"
}
