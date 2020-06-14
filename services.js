const kf1 = [
    {name: "KF Game Port", type: "UDP", portStart: "7707", portEnd: "7707"},
    {name: "KF Query Port", type: "UDP", portStart: "7708", portEnd: "7708"},
    {name: "KF Gamespy Port", type: "UDP", portStart: "7717", portEnd: "7717"},
    {name: "KF Master Server Port", type: "TCP/UDP", portStart: "28852", portEnd: "28852"},
    {name: "KF Steam Port", type: "UDP", portStart: "20560", portEnd: "20560"}
];

const kf2 = [
    {name: "KF2 Game Port", type: "UDP", portStart: "7777", portEnd: "7777"},
    {name: "KF2 Query Port", type: "UDP", portStart: "27015", portEnd: "27015"},
    {name: "KF2 Steam Port", type: "UDP", portStart: "20560", portEnd: "20560"}
];

const minecraft = [
    {name: "Minecraft", type: "TCP/UDP", portStart: "25565", portEnd: "25565"}
];

module.exports = {
    kf1,
    kf2,
    minecraft
};