#!/usr/bin/env bash

# Usage: ./scripts/unverified.sh
# This script is used to find unverified emails in the routes.ts file.

# get the verified emails from
emails=$(npm run list-email|grep -v "not verified"|grep "verified"|awk '{print $2}'|sort -u)

echo "Verified emails:"
echo "$emails"
echo

# get emails from the routes.ts file
emails_in_routes=$(grep -Eo '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' src/routes.ts | grep -v ieeetamu.org|sort -u)

echo "Emails in routes.ts:"
echo "$emails_in_routes"
echo

has_unverified=false
# check if the emails in the routes.ts file are verified
for email in $emails_in_routes; do
  if ! echo "$emails" | grep -q "$email"; then
    echo "Unverified email: $email"
    has_unverified=true
  fi
done

if [ "$has_unverified" = true ]; then
  echo "There are unverified emails in the routes.ts file."
  exit 1
else
  echo "All emails in the routes.ts file are verified."
fi

