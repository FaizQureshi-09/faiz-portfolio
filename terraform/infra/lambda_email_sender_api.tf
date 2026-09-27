#--------------------------------------------------------------------
# Source package
#--------------------------------------------------------------------
data "archive_file" "email_sender_api" {
  type        = "zip"
  source_dir  = "${path.module}/lambda_email_sender_api"
  output_path = "${path.module}/build/${local.email_sender_api_lambda_function_name}.zip"
  excludes    = ["__pycache__"]
}

#--------------------------------------------------------------------
# IAM role
#--------------------------------------------------------------------
data "aws_iam_policy_document" "email_sender_api_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "email_sender_api" {
  name               = local.email_sender_api_lambda_role_name
  assume_role_policy = data.aws_iam_policy_document.email_sender_api_assume_role.json
  tags               = local.tags
}

resource "aws_iam_role_policy_attachment" "email_sender_api_basic_execution" {
  role       = aws_iam_role.email_sender_api.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

#--------------------------------------------------------------------
# CloudWatch log group
#--------------------------------------------------------------------
resource "aws_cloudwatch_log_group" "email_sender_api" {
  name              = local.email_sender_api_lambda_log_group_name
  retention_in_days = var.lambda_log_retention_in_days
  tags              = local.tags
}

#--------------------------------------------------------------------
# Lambda function
#--------------------------------------------------------------------
resource "aws_lambda_function" "email_sender_api" {
  function_name    = local.email_sender_api_lambda_function_name
  role             = aws_iam_role.email_sender_api.arn
  handler          = "email_sender_api.lambda_handler"
  runtime          = var.lambda_runtime
  timeout          = var.email_sender_api_lambda_timeout
  memory_size      = var.email_sender_api_lambda_memory_size
  filename         = data.archive_file.email_sender_api.output_path
  source_code_hash = data.archive_file.email_sender_api.output_base64sha256

  environment {
    variables = {
      FROM_EMAIL                  = aws_ssm_parameter.email_sender_api_from_email.value
      SMTP_HOST                   = aws_ssm_parameter.smtp_host.value
      SMTP_PORT                   = aws_ssm_parameter.smtp_port.value
      SMTP_USER                   = aws_ssm_parameter.email_sender_api_from_email.value
      SMTP_PASSWORD_SSM_PARAMETER = aws_ssm_parameter.smtp_password.name
      API_KEY_SSM_PARAMETER       = aws_ssm_parameter.email_sender_api_key.name
      CORS_ALLOW_ORIGIN           = aws_ssm_parameter.cors_allow_origin.value
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.email_sender_api_basic_execution,
    aws_cloudwatch_log_group.email_sender_api,
  ]

  tags = local.tags
}

#--------------------------------------------------------------------
# SSM access (SMTP password + API key)
#--------------------------------------------------------------------
data "aws_iam_policy_document" "email_sender_api_read_ssm_secrets" {
  statement {
    actions = ["ssm:GetParameter"]
    resources = [
      aws_ssm_parameter.smtp_password.arn,
      aws_ssm_parameter.email_sender_api_key.arn,
    ]
  }

  statement {
    actions   = ["kms:Decrypt"]
    resources = ["arn:aws:kms:${var.aws_region}:${var.aws_account_id}:alias/aws/ssm"]
  }
}

resource "aws_iam_role_policy" "email_sender_api_read_ssm_secrets" {
  name   = "${local.email_sender_api_lambda_role_name}-read-ssm-secrets"
  role   = aws_iam_role.email_sender_api.id
  policy = data.aws_iam_policy_document.email_sender_api_read_ssm_secrets.json
}
