const DefaultRecipient = "chnorton@tamu.edu";

const BlackholeRecipient = "blackhole";

const Routes = [
    { "destination": "webmaster@ieeetamu.org", "recipients": ["chnorton@tamu.edu"] },
    { "destination": "president@ieeetamu.org", "recipients": ["oliver.jansen@tamu.edu"] },
    { "destination": "vicepresident@ieeetamu.org", "recipients": ["smayhue@tamu.edu"] },
    { "destination": "events@ieeetamu.org", "recipients": ["alanjaf@tamu.edu"] },
    { "destination": "donotreply@ieeetamu.org", "recipients": [BlackholeRecipient] },
    { "destination": "noreply@ieeetamu.org", "recipients": [BlackholeRecipient] },
]

export { Routes, DefaultRecipient, BlackholeRecipient };
