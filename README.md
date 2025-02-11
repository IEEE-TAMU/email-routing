# IEEE-TAMU Email Routes

This repo provides the code for the email routing system used by IEEE-TAMU. The system is designed to route emails to the appropriate officer based on the ieeetamu.org destination email address. The system is built using cloudflare workers and is automatically deployed using GitHub Apps.

## Adding a new officer
Add the officer's tamu.edu address to be elligible to recieve emails
```bash
npm run add-email <email>
```

The officer will need to verify the email address by clicking the link in the email sent to the address from cloudflare.

## Routing emails to the officer
Add the officer's ieeetamu.org address to the routing table by editing the [routes.ts](src/routes.ts) file. The officer's ieeetamu.org address should be the destination email address and the officer's tamu.edu address should be the recipient email address.

For example: to route emails addressed to `president@ieeetamu.org` to `netid@tamu.edu`, add the following line to the routes.ts file:
```typescript
{ "destination": "president@ieeetamu.org", "recipients": ["netid@tamu.edu"] }
```

## Checking if an officer is verified
Check if an officer's tamu.edu address is verified
```bash
npm run list-email
```

## Removing an officer
To stop routing emails to an officer, remove the officer's ieeetamu.org address from the routing table in the [routes.ts](src/routes.ts) file. The officer's tamu.edu address will still be verified and elligible to recieve emails.

If the officer's tamu.edu address should no longer be verified, remove the address from the list of verified emails
```bash
npm run delete-email <email>
```

NOTE: Only 200 emails can be added at a time. Officers not currently serving should be removed from the list of verified emails.
