#!/usr/bin/env bash

# Usage: npm run add-unverified
# Finds the emails in src/routes.ts that are not verified in Cloudflare and adds them.

set -uo pipefail

# get the verified emails
if ! output=$(npm run --silent list-email); then
  echo "Failed to list verified emails." >&2
  exit 1
fi

if ! echo "$output" | grep -q "Email addresses:"; then
  echo "Failed to list verified emails." >&2
  exit 1
fi

emails=$(echo "$output" | grep "verified" | grep -v "not verified" | awk '{print $2}' | sort -u)

# get emails from the routes.ts file
emails_in_routes=$(grep -Eo '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' src/routes.ts | grep -v ieeetamu.org | sort -u)

# find the emails in routes.ts that are not verified
unverified=()
for email in $emails_in_routes; do
  if ! echo "$emails" | grep -qxF "$email"; then
    unverified+=("$email")
  fi
done

if [ ${#unverified[@]} -eq 0 ]; then
  echo "All emails in the routes.ts file are verified."
  exit 0
fi

echo "Adding unverified emails:"
for email in "${unverified[@]}"; do
  echo "- $email"
done
echo

failed=0
for email in "${unverified[@]}"; do
  if ! npm run --silent add-email "$email"; then
    failed=1
  fi
done

exit $failed
