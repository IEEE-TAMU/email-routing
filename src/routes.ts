const DefaultRecipient = "chnorton+ieee@tamu.edu";

const BlackholeRecipient = "blackhole";

const Routes = [
    { "destination": "webmaster@ieeetamu.org", "recipients": ["chnorton+ieee@tamu.edu"] },
    { "destination": "president@ieeetamu.org", "recipients": ["oliver.jansen@tamu.edu"] },
    { "destination": "donotreply@ieeetamu.org", "recipients": [BlackholeRecipient] },
    { "destination": "noreply@ieeetamu.org", "recipients": [BlackholeRecipient] },
]

export { Routes, DefaultRecipient, BlackholeRecipient };
