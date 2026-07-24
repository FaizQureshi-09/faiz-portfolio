#--------------------------------------------------------------------
# Parameter
#--------------------------------------------------------------------
# The real password is set out-of-band (AWS Console or
# `aws ssm put-parameter --name <name> --type SecureString --value <password> --overwrite`)
# after the parameter is created. Terraform only owns its existence, not its
# value, so `terraform apply` never prompts for it and never overwrites a
# manually-rotated password.
resource "aws_ssm_parameter" "smtp_password" {
  name        = local.smtp_password_parameter_name
  description = "SMTP authentication password for the contact form email sender Lambda. Value is managed out-of-band; Terraform ignores changes to it."
  type        = "SecureString"
  value       = "REPLACE_ME_VIA_CONSOLE_OR_CLI"
  tags        = local.tags

  lifecycle {
    ignore_changes = [value]
  }
}

#--------------------------------------------------------------------
# Non-secret config parameters
#--------------------------------------------------------------------
# Everything the Lambda needs besides the SMTP password also lives in SSM,
# for a consistent, centrally-visible config story. Unlike the password,
# these aren't fetched at runtime — Terraform reads their value at apply
# time straight into the Lambda's environment variables, so there's no
# extra network round trip (and therefore no added latency) on every
# invocation.
resource "aws_ssm_parameter" "from_email" {
  name        = local.from_email_parameter_name
  description = "Verified sender address used in the contact form email's From header."
  type        = "String"
  value       = var.contact_form_from_email
  tags        = local.tags
}

resource "aws_ssm_parameter" "to_email" {
  name        = local.to_email_parameter_name
  description = "Inbox that receives contact form submissions."
  type        = "String"
  value       = var.contact_form_to_email
  tags        = local.tags
}

resource "aws_ssm_parameter" "smtp_host" {
  name        = local.smtp_host_parameter_name
  description = "SMTP server hostname used to send contact form emails."
  type        = "String"
  value       = var.smtp_host
  tags        = local.tags
}

resource "aws_ssm_parameter" "smtp_port" {
  name        = local.smtp_port_parameter_name
  description = "SMTP server port used to send contact form emails."
  type        = "String"
  value       = tostring(var.smtp_port)
  tags        = local.tags
}

resource "aws_ssm_parameter" "smtp_user" {
  name        = local.smtp_user_parameter_name
  description = "SMTP authentication username."
  type        = "String"
  value       = var.smtp_user
  tags        = local.tags
}

resource "aws_ssm_parameter" "cors_allow_origin" {
  name        = local.cors_allow_origin_parameter_name
  description = "Value returned in the Access-Control-Allow-Origin header."
  type        = "String"
  value       = var.cors_allow_origin
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
