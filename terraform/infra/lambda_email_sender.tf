#--------------------------------------------------------------------
# Source package
#--------------------------------------------------------------------
data "archive_file" "email_sender" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  output_path = "${path.module}/build/${local.lambda_function_name}.zip"
  excludes    = ["__pycache__"]
}

#--------------------------------------------------------------------
# IAM role
#--------------------------------------------------------------------
data "aws_iam_policy_document" "email_sender_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "email_sender" {
  name               = local.lambda_role_name
  assume_role_policy = data.aws_iam_policy_document.email_sender_assume_role.json
  tags               = local.tags
}

resource "aws_iam_role_policy_attachment" "email_sender_basic_execution" {
  role       = aws_iam_role.email_sender.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

#--------------------------------------------------------------------
# CloudWatch log group
#--------------------------------------------------------------------
resource "aws_cloudwatch_log_group" "email_sender" {
  name              = local.lambda_log_group_name
  retention_in_days = var.lambda_log_retention_in_days
  tags              = local.tags
}

#--------------------------------------------------------------------
# Lambda function
#--------------------------------------------------------------------
resource "aws_lambda_function" "email_sender" {
  function_name    = local.lambda_function_name
  role             = aws_iam_role.email_sender.arn
  handler          = "email_sender.lambda_handler"
  runtime          = var.lambda_runtime
  timeout          = var.lambda_timeout
  memory_size      = var.lambda_memory_size
  filename         = data.archive_file.email_sender.output_path
  source_code_hash = data.archive_file.email_sender.output_base64sha256

  environment {
    variables = {
      FROM_EMAIL                  = aws_ssm_parameter.from_email.value
      TO_EMAIL                    = aws_ssm_parameter.to_email.value
      SMTP_HOST                   = aws_ssm_parameter.smtp_host.value
      SMTP_PORT                   = aws_ssm_parameter.smtp_port.value
      SMTP_USER                   = aws_ssm_parameter.smtp_user.value
      SMTP_PASSWORD_SSM_PARAMETER = aws_ssm_parameter.smtp_password.name
      CORS_ALLOW_ORIGIN           = aws_ssm_parameter.cors_allow_origin.value
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.email_sender_basic_execution,
    aws_cloudwatch_log_group.email_sender,
  ]

  tags = local.tags
}

#--------------------------------------------------------------------
# Self-invoke permission (async auto-reply dispatch)
#--------------------------------------------------------------------
# The auto-reply is sent by having the Lambda asynchronously invoke itself
# rather than sending it inline — see email_sender.py. That keeps the
# second SMTP session off the critical path the caller waits on.
data "aws_iam_policy_document" "email_sender_self_invoke" {
  statement {
    actions   = ["lambda:InvokeFunction"]
    resources = [aws_lambda_function.email_sender.arn]
  }
}

resource "aws_iam_role_policy" "email_sender_self_invoke" {
  name   = "${local.lambda_role_name}-self-invoke"
  role   = aws_iam_role.email_sender.id
  policy = data.aws_iam_policy_document.email_sender_self_invoke.json
}
