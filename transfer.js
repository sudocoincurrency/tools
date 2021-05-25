const WebSocket = require('ws');
const prompt = require('prompt-sync')();
const wait = require('util').promisify(setTimeout); 

const password = Buffer.from(prompt('password: ')).toString('base64');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const ws = new WebSocket('ws://188.165.82.203:90');

let authenticated = false;

const wsHandlers = {
    success: async () => {
        authenticated = true; 
        console.log('authenticated')

        let userToSend = parseInt(prompt('id of user you want to send to: '));
        let amountToSend = parseFloat(prompt('amount to send: '));
    
        ws.send(JSON.stringify(['transfer', { amount: amountToSend, to: userToSend }]));
        ws.close();
    },
    refusal: () => { console.log('refusal'); }
}

ws.onopen = async () => {
    ws.send(JSON.stringify([ 'auth', { password: password } ]));
}

ws.onmessage = s => {
    

    const d = JSON.parse(s.data);
    wsHandlers[d[0]] && wsHandlers[d[0]](...d.slice(1));
};