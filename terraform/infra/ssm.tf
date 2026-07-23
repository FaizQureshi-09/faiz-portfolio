#--------------------------------------------------------------------
# Parameter
#--------------------------------------------------------------------
resource "aws_ssm_parameter" "smtp_password" {
  name        = local.smtp_password_parameter_name
  description = "SMTP authentication password for the contact form email sender Lambda."
  type        = "SecureString"
  value       = var.smtp_password
  tags        = local.tags
}

#--------------------------------------------------------------------
# Lambda access
#--------------------------------------------------------------------
data "aws_iam_policy_document" "email_sender_read_smtp_password" {
  statement {
    actions   = ["ssm:GetParameter"]
    resources = [aws_ssm_parameter.smtp_password.arn]
  }

  statement {
    actions   = ["kms:Decrypt"]
    resources = ["arn:aws:kms:${var.aws_region}:${var.aws_account_id}:alias/aws/ssm"]
  }
}

resource "aws_iam_role_policy" "email_sender_read_smtp_password" {
  name   = "${local.lambda_role_name}-read-smtp-password"
  role   = aws_iam_role.email_sender.id
  policy = data.aws_iam_policy_document.email_sender_read_smtp_password.json
}
