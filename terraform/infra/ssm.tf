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
