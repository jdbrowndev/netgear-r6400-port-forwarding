# netgear-r6400-port-forwarding

This node script scrapes the NETGEAR R6400 web interface to add/remove port forwarding entries. The web interface does not allow entries to be disabled once added, so it's convenient to automate the add/remove process when using game servers.

# Build

A Dockerfile is included to build the script's environment.

`docker build -t port-forwarding .`

# Run

The router's IP, user, and password are required environment variables.

```
docker run -it --name port-forwarding \
        -e ROUTER_IP=192.168.1.1 \
        -e ROUTER_USER=(user) \
        -e ROUTER_PASS=(pass) \
        port-forwarding
```