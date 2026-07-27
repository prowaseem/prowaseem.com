#!/usr/bin/env bash
set -euo pipefail

export AWS_PROFILE=personal

if ! aws sts get-caller-identity >/dev/null 2>&1; then
  echo "AWS SSO session expired. Starting login..."
  aws sso login --sso-session personal-session
fi

echo "Building site..."
npm run build

echo "Clearing existing S3 bucket contents..."
aws s3 rm s3://prowaseem.com --recursive

echo "Uploading dist/ to S3..."
aws s3 cp dist s3://prowaseem.com/ --recursive

echo "Deploy complete."
