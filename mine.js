const WebSocket = require('ws');
const prompt = require('prompt-sync')();
const wait = require('util').promisify(setTimeout); 

//const password = require('crypto').createHash('sha256').update(prompt('password: ')).digest('binary');
const password = Buffer.from(prompt('password: ')).toString('base64');
//console.log(password);

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const wsHandlers = {
    success: async () => {
        authenticated = true; 
        console.log('authenticated')
        while(true) {
            console.log('mining...');
            ws.send(JSON.stringify([ 'mine' ]));
            await wait(5100);
        }
    },
    balUpdate: s => { console.log(`new bal: ${s.newBal}`) },
    refusal: () => { console.log('refusal'); },
    minefail: s => { console.log(s.fail); process.exit(); }
}

//const ws = new WebSocket('ws://188.165.82.203:90');
const ws = new WebSocket('ws://localhost:90');

let authenticated = false;

ws.onopen = async () => {
    ws.send(JSON.stringify([ 'auth', { password: password } ]));

    // while(true) {
    //     if (!authenticated) continue;
    //     console.log('mining...');
    //     ws.send(JSON.stringify([ 'mine' ]));
    //     wait(5000);
    // }
}

ws.onmessage = s => {
    

    const d = JSON.parse(s.data);
    wsHandlers[d[0]] && wsHandlers[d[0]](...d.slice(1));
};

ws.onclose = () => {console.log('disconnected'); process.exit();};
