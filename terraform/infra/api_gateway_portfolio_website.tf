#--------------------------------------------------------------------
# HTTP API
#--------------------------------------------------------------------
resource "aws_apigatewayv2_api" "portfolio_website" {
  name          = local.api_gateway_name
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = [var.cors_allow_origin]
    allow_methods = ["OPTIONS", "POST"]
    allow_headers = ["Content-Type"]
  }

  tags = local.tags
}

resource "aws_apigatewayv2_stage" "portfolio_website" {
  api_id      = aws_apigatewayv2_api.portfolio_website.id
  name        = var.api_gateway_stage_name
  auto_deploy = true
  tags        = local.tags
}

#--------------------------------------------------------------------
# Email sender integration + route
#--------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "email_sender" {
  api_id                 = aws_apigatewayv2_api.portfolio_website.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.email_sender.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "email_sender_post" {
  api_id    = aws_apigatewayv2_api.portfolio_website.id
  route_key = "POST ${var.contact_form_route_path}"
  target    = "integrations/${aws_apigatewayv2_integration.email_sender.id}"
}

resource "aws_lambda_permission" "allow_api_gateway_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.email_sender.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.portfolio_website.execution_arn}/*/*"
}
