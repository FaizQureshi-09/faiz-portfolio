#!/bin/bash

set -e

show_help() {
  echo "Usage: $0 <env>"
  echo
  echo "Deploy Terraform configuration for a specific environment."
  echo
  echo "Prerequisites:"
  echo "  1. Configure AWS CLI with appropriate access keys before running:"
  echo "       aws configure --profile <AWS_PROFILE_NAME>"
  echo "     (This ensures Terraform can authenticate with AWS.)"
  echo
  echo "Command:"
  echo "Example : ./infra_deploy.sh"
  echo
  echo
  echo "Options:"
  echo "  -h, --help    Show this help message and exit"
}

# Handle help option
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
  show_help
  exit 0
fi

VAR_FILE="env.tfvars"
TARGET_DIRECTORY="../infra"
BACKEND_CONFIG="backend.hcl"

cd $TARGET_DIRECTORY

echo "TERRAFORM init ......................."
terraform init -reconfigure -backend-config="$BACKEND_CONFIG"

echo "TERRAFORM validate ......................."
terraform validate

echo "TERRAFORM fmt ......................."
terraform fmt

echo "TERRAFORM apply ......................."
terraform apply -var-file="$VAR_FILE"
