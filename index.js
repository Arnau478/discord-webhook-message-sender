// ┌────────────────────────────────┐
// │                                │
// │ discord-webhook-message-sender │
// │                                │
// │        Made by Arnau478        │
// │                                │
// └────────────────────────────────┘

const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var id_token;
var username;
var tts;

var verbose = process.argv.includes('-v');

function httpsPost({body, ...options}) {
    return new Promise((resolve,reject) => {
        const req = https.request({
            method: 'POST',
            ...options,
        }, res => {
            const chunks = [];
            res.on('data', data => chunks.push(data))
            res.on('end', () => {
                let body = Buffer.concat(chunks);
                switch(res.headers['content-type']) {
                    case 'application/json':
                        body = JSON.parse(body);
                        break;
                }
                resolve(body)
            })
        })
        req.on('error',reject);
        if(body) {
            req.write(body);
        }
        req.end();
    })
}

function sendMessage(msg){
    var data = JSON.stringify({
        username: username,
        tts: tts == "true" || tts == true,
        content: msg,
    })

    httpsPost({
        hostname: 'discord.com',
        path: `/api/webhooks/${id_token}`,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        },
        body: data
    })
}

console.log(`
    \x1b[34m┌────────────────────────────────┐
    \x1b[34m│                                │
    \x1b[34m│ \x1b[32mdiscord-webhook-message-sender\x1b[34m │
    \x1b[34m│                                │
    \x1b[34m│        \x1b[33mMade by Arnau478\x1b[34m        │
    \x1b[34m│                                │
    \x1b[34m└────────────────────────────────┘\x1b[0m
     \x1b[32mPress Ctrl+C at any time to exit\x1b[0m
`);

askID();
function askID(){
    rl.question('\x1b[34mClient id and token (In format: id/token): \x1b[0m', (a) => {
        id_token = a;
        if(verbose) console.log('\x1b[90mSet id_token to "' + a + '"\x1b[0m');
        askUsername();
    });
}

function askUsername(){
    rl.question('\x1b[34mUsername (Leave blank for default): \x1b[0m', (a) => {
        username = a;
        if(verbose) console.log('\x1b[90mSet username to "' + a + '"\x1b[0m');
        askTts();
    });
}

function askTts(){
    rl.question('\x1b[34mTTS (Leave blank for false): \x1b[0m', (a) => {
        tts = a == "true";
        if(verbose) console.log('\x1b[90mSet tts to "' + tts + '"\x1b[0m');
        askMessage();
    });
}

function askMessage(){
    rl.question('\x1b[32mMessage: \x1b[0m', (a) => {
        sendMessage(a);
        if(verbose) console.log('\x1b[90mSent "' + a + '"\x1b[0m');
        askMessage();
    });
}