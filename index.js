const services = require('./services');
const axios = require('axios');
const qs = require('querystring')
const cheerio = require('cheerio');
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Load configuration
const {ROUTER_IP, ROUTER_USER, ROUTER_PASS} = process.env;

// Validate configuration
let validationErrors = "";
if (!ROUTER_IP)
    validationErrors += "ROUTER_IP env var is required but not found\n";
if (!ROUTER_USER)
    validationErrors += "ROUTER_USER env var is required but not found\n";
if (!ROUTER_PASS)
    validationErrors += "ROUTER_PASS env var is required but not found\n";
if (validationErrors) {
    console.log(`Exiting due to missing configuration variables:\n${validationErrors}`)
    process.exit(1);
}

// Print instructions
console.log("Port forwarding CLI loaded.\n");
console.log('Run "services" to print supported services.');
console.log('Run "add <service> <internalip>" to add port forwarding entries.');
console.log('Run "delete" to delete all port forwarding entries.');
console.log('Run "exit" to exit the CLI.\n');

// Start CLI loop
rl.setPrompt("> ");
rl.prompt();
rl.on("line", async (cmd) => {
    cmd = cmd.toLowerCase();
    if (cmd == "services") {
        Object.keys(services).forEach(x => console.log(x));
    } else if (cmd.startsWith("add")) {
        let [_, serviceName, internalip] = cmd.split(" ");
        await addEntries(services[serviceName], internalip);
    } else if (cmd == "delete") {
        await deleteEntries();
    } else if (cmd == "exit") {
        process.exit(0);
    } else {
        console.log("Unrecognized command.");
    }
    rl.prompt();
});

async function addEntries(service, internalip) {
    const auth = {username: ROUTER_USER, password: ROUTER_PASS};

    // get the port forwarding page
    const cookie = await getXsrfTokenCookie(auth);
    const pageResponse = await axios.get(`http://${ROUTER_IP}/FW_forward3.htm`, {auth, headers: {Cookie: cookie}});
    const $ = cheerio.load(pageResponse.data);
    
    // get the post action
    const action = $('form').first().attr('action');
    const postUrl = `http://${ROUTER_IP}/${action}`;
    
    // add entries
    for (let entry of service) {
        const ipNumbers = internalip.split(".");
        const payload = {
            "apply": "Apply",
            "portname": entry.name,
            "srvtype": entry.type,
            "port_start": `${entry.portStart}`,
            "same_range": "same_range",
            "server_ip1": ipNumbers[0],
            "server_ip2": ipNumbers[1],
            "server_ip3": ipNumbers[2],
            "server_ip4": ipNumbers[3],
            "MacSelect": "on",
            "action": "add_apply",
            "oldService": "",
            "oldService2": "",
            "oldService3": "",
            "oldType": "",
            "newType": entry.type,
            "oldSport": "",
            "oldInternalSport": "",
            "oldIP": "",
            "newIP": internalip,
            "lanIP": ROUTER_IP,
            "entryData": "",
            "arrange_flag": 0,
            "pf_services_tbl": ""
        };

        const data = qs.stringify(payload);
        const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        await axios.post(postUrl, data, {auth, headers});
    }

    console.log("Entries added.");
}

async function deleteEntries() {
    const auth = {username: ROUTER_USER, password: ROUTER_PASS};

    // get the port forwarding page
    const cookie = await getXsrfTokenCookie(auth);
    const pageResponse = await axios.get(`http://${ROUTER_IP}/FW_forward3.htm`, {auth, headers: {Cookie: cookie}});
    const $ = cheerio.load(pageResponse.data);
    
    // get the post action
    const action = $('form').first().attr('action');
    const postUrl = `http://${ROUTER_IP}/${action}`;

    // delete all entries
    const numEntries = $('table.subhead2-table').find('table').eq(1).find('tr').length - 1;
    for (let i = 0; i < numEntries; i++) {
        const payload = {
            "Delete": "Delete Service",
            "serv_type": "pf",
            "SV_IP1": "",
            "SV_IP2": "",
            "SV_IP3": "",
            "SV_IP4": "",
            "RouteSelect": 1,
            "selectService": "",
            "lanIP": ROUTER_IP,
            "action": "delete",
            "selectEntry": 1,
            "inputIP": "",
            "entryData": "",
            "fwpf_enable": "",
            "arrange_flag": 0
        };

        const data = qs.stringify(payload);
        const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        await axios.post(postUrl, data, {auth, headers});
    }

    console.log("All entries deleted.");
}

async function getXsrfTokenCookie(auth) {
    let cookie = "";
    try {
        await axios.get(`http://${ROUTER_IP}`, {auth});
    } catch (error) {
        const setCookie = error.response.headers['set-cookie'][0];
        cookie = setCookie.split(' ')[0];
    }
    return cookie;
}