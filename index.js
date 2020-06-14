// Load configuration
const [ROUTER_IP, ROUTER_USER, ROUTER_PASS, INTERNAL_IP] = process.env;
const ROUTER_LOGIN_URL = `http://${ROUTER_IP}`;
const ROUTER_PORT_FORWARDING_PAGE = `http://${ROUTER_IP}/FW_forward3.htm`;
const ROUTER_PORT_FORWARDING_ADD_SCRIPT = `http://${ROUTER_IP}/pforward.cgi`;
const ROUTER_PORT_FORWARDING_DELETE_SCRIPT = `http://${ROUTER_IP}/pforward.cgi`;