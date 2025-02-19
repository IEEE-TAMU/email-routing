const DefaultRecipient = "chnorton@tamu.edu";

const BlackholeRecipient = "blackhole";

const Routes = [
    { "destination": "webmaster@ieeetamu.org", "recipients": ["chnorton@tamu.edu"] },
    { "destination": "marketing@ieeetamu.org", "recipients": ["chnorton@tamu.edu", "n0603919@outlook.com"] },
    { "destination": "donotreply@ieeetamu.org", "recipients": [BlackholeRecipient] },
    { "destination": "noreply@ieeetamu.org", "recipients": [BlackholeRecipient] },
]

export { Routes, DefaultRecipient, BlackholeRecipient };
