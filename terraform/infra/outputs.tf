#--------------------------------------------------------------------
# Lambda - email sender
#--------------------------------------------------------------------
output "lambda_function_name" {
  description = "Name of the email sender Lambda function."
  value       = aws_lambda_function.email_sender.function_name
}

output "lambda_function_arn" {
  description = "ARN of the email sender Lambda function."
  value       = aws_lambda_function.email_sender.arn
}

output "lambda_function_invoke_arn" {
  description = "Invoke ARN of the email sender Lambda function, used by the API Gateway integration."
  value       = aws_lambda_function.email_sender.invoke_arn
}

output "lambda_role_name" {
  description = "Name of the IAM role assumed by the email sender Lambda function."
  value       = aws_iam_role.email_sender.name
}

output "lambda_role_arn" {
  description = "ARN of the IAM role assumed by the email sender Lambda function."
  value       = aws_iam_role.email_sender.arn
}

output "lambda_log_group_name" {
  description = "Name of the CloudWatch log group for the email sender Lambda function."
  value       = aws_cloudwatch_log_group.email_sender.name
}

output "lambda_log_group_arn" {
  description = "ARN of the CloudWatch log group for the email sender Lambda function."
  value       = aws_cloudwatch_log_group.email_sender.arn
}

#--------------------------------------------------------------------
# API Gateway - portfolio website
#--------------------------------------------------------------------
output "api_gateway_id" {
  description = "ID of the portfolio website HTTP API."
  value       = aws_apigatewayv2_api.portfolio_website.id
}

output "api_gateway_execution_arn" {
  description = "Execution ARN of the portfolio website HTTP API."
  value       = aws_apigatewayv2_api.portfolio_website.execution_arn
}

output "api_gateway_endpoint" {
  description = "Base endpoint URL of the portfolio website HTTP API."
  value       = aws_apigatewayv2_api.portfolio_website.api_endpoint
}

output "api_gateway_stage_name" {
  description = "Name of the deployed API Gateway stage (environment)."
  value       = aws_apigatewayv2_stage.portfolio_website.name
}

output "api_gateway_stage_invoke_url" {
  description = "Invoke URL of the deployed API Gateway stage."
  value       = aws_apigatewayv2_stage.portfolio_website.invoke_url
}

output "contact_form_endpoint" {
  description = "Invoke URL for the contact form POST endpoint."
  value       = "${aws_apigatewayv2_stage.portfolio_website.invoke_url}${var.contact_form_route_path}"
}

#--------------------------------------------------------------------
# SSM - SMTP password
#--------------------------------------------------------------------
output "smtp_password_parameter_name" {
  description = "Name of the SSM SecureString parameter holding the SMTP password."
  value       = aws_ssm_parameter.smtp_password.name
}

output "smtp_password_parameter_arn" {
  description = "ARN of the SSM SecureString parameter holding the SMTP password."
  value       = aws_ssm_parameter.smtp_password.arn
}
