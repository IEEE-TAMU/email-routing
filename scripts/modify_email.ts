import Cloudflare from 'cloudflare';
import dotenv from 'dotenv';

dotenv.config();

const client = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_API_TOKEN, // token with Account:Email Routing Addresses:Edit permissions
});

const account_id = process.env.CLOUDFLARE_ACCOUNT_ID!; // account id for the domain
if (!account_id) {
  console.error('CLOUDFLARE_ACCOUNT_ID is not set');
  process.exit(1);
}

async function getAddresses() {
  const addresses: Cloudflare.EmailRouting.Addresses.Address[] = [];
  try {
    for await (const address of client.emailRouting.addresses.list({ account_id })) {
      addresses.push(address);
    }
  } catch (error) {
    console.error('Error fetching email addresses:', error);
  }
  return addresses;
}

async function getIdFromEmail(email: string) {
  const addresses = await getAddresses();
  const address = addresses.find((address) => address.email! === email);
  return address?.id;
}

function usage () {
  console.error('See README.md for usage');
  process.exit(1);
}

// read cmd line arguments
const method = process.argv[2]; // add, list, delete
const email = process.argv[3];

switch (method) {
  case 'list':
    getAddresses().then((addresses) => {
      console.log('Email addresses:');
      addresses.forEach((address) => {
        const verified = address.verified ? 'verified' : 'not verified';
        console.log(`- ${address.email} - ${verified}`);
      });
    });
    break;
  case 'add':
    if (!email) {
      usage();
    }
    client.emailRouting.addresses.create({ account_id, email }).then(() => {
      console.log(`Email address ${email} added`);
      console.log('Please check your inbox for a confirmation email');
    });
    break;
  case 'delete':
    if (!email) {
      usage();
    }
    getIdFromEmail(email).then((id) => {
      if (id) {
        client.emailRouting.addresses.delete(id, {account_id}).then(() => {
          console.log(`Email address ${email} deleted`);
        });
      } else {
        console.error(`Email address ${email} not found`);
      }
    });
    break;
  default:
    usage();
}