#--------------------------------------------------------------------
# Source package
#--------------------------------------------------------------------
data "archive_file" "get_experience" {
  type        = "zip"
  source_dir  = "${path.module}/lambda_get_experience"
  output_path = "${path.module}/build/${local.experience_lambda_function_name}.zip"
  excludes    = ["__pycache__"]
}

#--------------------------------------------------------------------
# IAM role
#--------------------------------------------------------------------
data "aws_iam_policy_document" "get_experience_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "get_experience" {
  name               = local.experience_lambda_role_name
  assume_role_policy = data.aws_iam_policy_document.get_experience_assume_role.json
  tags               = local.tags
}

resource "aws_iam_role_policy_attachment" "get_experience_basic_execution" {
  role       = aws_iam_role.get_experience.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

#--------------------------------------------------------------------
# CloudWatch log group
#--------------------------------------------------------------------
resource "aws_cloudwatch_log_group" "get_experience" {
  name              = local.experience_lambda_log_group_name
  retention_in_days = var.lambda_log_retention_in_days
  tags              = local.tags
}

#--------------------------------------------------------------------
# Lambda function
#--------------------------------------------------------------------
resource "aws_lambda_function" "get_experience" {
  function_name    = local.experience_lambda_function_name
  role             = aws_iam_role.get_experience.arn
  handler          = "get_experience.lambda_handler"
  runtime          = var.lambda_runtime
  timeout          = var.experience_lambda_timeout
  memory_size      = var.experience_lambda_memory_size
  filename         = data.archive_file.get_experience.output_path
  source_code_hash = data.archive_file.get_experience.output_base64sha256

  environment {
    variables = {
      START_DATE        = aws_ssm_parameter.start_date.value
      CORS_ALLOW_ORIGIN = aws_ssm_parameter.cors_allow_origin.value
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.get_experience_basic_execution,
    aws_cloudwatch_log_group.get_experience,
  ]

  tags = local.tags
}
