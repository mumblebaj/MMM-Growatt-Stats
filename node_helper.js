var NodeHelper = require('node_helper')
var api = require('growatt')

const servers = {
    main: 'https://server.growatt.com',
    us: 'https://server-us.growatt.com'
}

const options = {
    plantData: true,
    weather: false,
    totalData: true,
    statusData: true,
    deviceData: false,
    deviceType: false,
    historyLast: true,
    historyAll: false
}

module.exports = NodeHelper.create({
    requiresVersion: '2.23.0',

    start: function () {
        console.log('Starting node helper for ' + this.name)
    },

    deconstructPlantData: function (d, payload) {
        plantDataFiltered = [];

        let keys = "";
        let deviceSerial = "";
        let data = [];

        keys = Object.keys(d);

        keys.forEach(key => {
            let {
                devices,
                ...rest
            } = d[key];
            deviceSerial = Object.keys(devices);
            let devicesData = [];
            deviceSerial.forEach(sn => {

                if (devices[sn].growattType === "storage") {
                    devicesData.push({
                        sn: sn,
                        data: devices[sn],
                    });
                    data.push({
                        plantid: key,
                        data: {
                            ...rest,
                            devicesData
                        }
                    })
                    let epvTotal = parseInt(data[0].data.devicesData[0].data.totalData.epvTotal) / 1000;
                    let dischargeTotal = parseInt(data[0].data.devicesData[0].data.totalData.eDischargeTotal) / 1000;
                    let chargeTotal = parseInt(data[0].data.devicesData[0].data.totalData.chargeTotal) / 1000;
                    plantDataFiltered.push({
                        "growattType": "storage",
                        "plantName": data[0].data.plantName,
                        "country": data[0].data.plantData.country,
                        "city": data[0].data.plantData.city,
                        "accountName": data[0].data.plantData.accountName,
                        "inverterPower": data[0].data.plantData.nominalPower,
                        "treesSaved": data[0].data.plantData.tree,
                        "coalSaved": data[0].data.plantData.coal,
                        "useEnergyToday": data[0].data.devicesData[0].data.totalData.useEnergyToday,
                        "useEnergyTotal": data[0].data.devicesData[0].data.totalData.useEnergyTotal,
                        "chargeToday": data[0].data.devicesData[0].data.totalData.chargeToday,
                        "chargeTotal": chargeTotal,
                        "eDischargeTotal": dischargeTotal,
                        "eDischargeToday": data[0].data.devicesData[0].data.totalData.eDischargeToday,
                        "eToUserTotal": data[0].data.devicesData[0].data.totalData.eToUserTotal,
                        "eToUserToday": data[0].data.devicesData[0].data.totalData.eToUserToday,
                        "epvToday": data[0].data.devicesData[0].data.totalData.epvToday,
                        "epvTotal": epvTotal
                    })
                } else if (devices[sn].growattType === "tlxh") {
                    devicesData.push({
                        sn: sn,
                        data: devices[sn],
                    });
                    data.push({
                        plantid: key,
                        data: {
                            ...rest,
                            devicesData
                        }
                    })
                    let epv1Today = data[0].data.devicesData[0].data.historyLast.epv1Today;
                    let epv2Today = data[0].data.devicesData[0].data.historyLast.epv2Today;
                    let epv3Today = data[0].data.devicesData[0].data.historyLast.epv3Today;
                    let epv4Today = data[0].data.devicesData[0].data.historyLast.epv4Today;
                    let epvToday = parseInt(epv1Today) + parseInt(epv2Today) + parseInt(epv3Today) + parseInt(epv4Today);
                    let eselfToday = data[0].data.devicesData[0].data.historyLast.eselfToday;
                    let eselfTotal = data[0].data.devicesData[0].data.historyLast.eselfTotal;
                    let esystemToday = data[0].data.devicesData[0].data.historyLast.esystemToday;
                    let esystemTotal = data[0].data.devicesData[0].data.historyLast.esystemTotal;
                    let exportedToGridToday = parseInt(esystemToday) - parseInt(eselfToday);
                    let exportedToGridTotal = parseInt(esystemTotal) - parseInt(eselfTotal);
                    plantDataFiltered.push({
                        "growattType": "tlxh",
                        "plantName": data[0].data.plantName,
                        "country": data[0].data.plantData.country,
                        "city": data[0].data.plantData.city,
                        "accountName": data[0].data.plantData.accountName,
                        "inverterPower": data[0].data.plantData.nominalPower,
                        "treesSaved": data[0].data.plantData.tree,
                        "coalSaved": data[0].data.plantData.coal,
                        "useEnergyToday": data[0].data.devicesData[0].data.historyLast.elocalLoadToday,
                        "useEnergyTotal": data[0].data.devicesData[0].data.historyLast.elocalLoadTotal,
                        "chargeToday": data[0].data.devicesData[0].data.historyLast.echargeToday,
                        "chargeTotal": data[0].data.devicesData[0].data.historyLast.echargeTotal,
                        "eDischargeTotal": data[0].data.devicesData[0].data.historyLast.edischargeTotal,
                        "eDischargeToday": data[0].data.devicesData[0].data.historyLast.edischargeToday,
                        "eToUserTotal": exportedToGridTotal,
                        "eToUserToday": exportedToGridToday,
                        "epvToday": epvToday,
                        "epvTotal": data[0].data.devicesData[0].data.historyLast.epvTotal
                    })
                } else if (devices[sn].growattType === "tlx") {
                    devicesData.push({
                        sn: sn,
                        data: devices[sn],
                    });

                    data.push({
                        plantid: key,
                        data: {
                            ...rest,
                            devicesData
                        }
                    })
                    let epv1Today = data[0].data.devicesData[0].data.historyLast.epv1Today;
                    let epv2Today = data[0].data.devicesData[0].data.historyLast.epv2Today;
                    let epv3Today = data[0].data.devicesData[0].data.historyLast.epv3Today;
                    let epv4Today = data[0].data.devicesData[0].data.historyLast.epv4Today;
                    let epvToday = parseInt(epv1Today) + parseInt(epv2Today) + parseInt(epv3Today) + parseInt(epv4Today);
                    let eselfToday = data[0].data.devicesData[0].data.historyLast.eselfToday;
                    let eselfTotal = data[0].data.devicesData[0].data.historyLast.eselfTotal;
                    let esystemToday = data[0].data.devicesData[0].data.historyLast.esystemToday;
                    let esystemTotal = data[0].data.devicesData[0].data.historyLast.esystemTotal;
                    let exportedToGridToday = parseInt(esystemToday) - parseInt(eselfToday);
                    let exportedToGridTotal = parseInt(esystemTotal) - parseInt(eselfTotal);
                    plantDataFiltered.push({
                        "growattType": "tlx",
                        "plantName": data[0].data.plantName,
                        "country": data[0].data.plantData.country,
                        "city": data[0].data.plantData.city,
                        "accountName": data[0].data.plantData.accountName,
                        "inverterPower": data[0].data.plantData.nominalPower,
                        "treesSaved": data[0].data.plantData.tree,
                        "coalSaved": data[0].data.plantData.coal,
                        "useEnergyToday": data[0].data.devicesData[0].data.historyLast.elocalLoadToday,
                        "useEnergyTotal": data[0].data.devicesData[0].data.historyLast.elocalLoadTotal,
                        "chargeToday": data[0].data.devicesData[0].data.historyLast.echargeToday,
                        "chargeTotal": data[0].data.devicesData[0].data.historyLast.echargeTotal,
                        "eDischargeTotal": data[0].data.devicesData[0].data.historyLast.edischargeTotal,
                        "eDischargeToday": data[0].data.devicesData[0].data.historyLast.edischargeToday,
                        "eToUserTotal": exportedToGridTotal,
                        "eToUserToday": exportedToGridToday,
                        "epvToday": epvToday,
                        "epvTotal": data[0].data.devicesData[0].data.historyLast.epvTotal
                    })
                } else if (devices[sn].growattType === "mix") {
                    devicesData.push({
                        sn: sn,
                        data: devices[sn],
                    });

                    data.push({
                        plantid: key,
                        data: {
                            ...rest,
                            devicesData
                        }
                    })
                } else if (devices[sn].growattType === "spa") {
                    devicesData.push({
                        sn: sn,
                        data: devices[sn],
                    });

                    data.push({
                        plantid: key,
                        data: {
                            ...rest,
                            devicesData
                        }
                    })
                } else if (devices[sn].growattType === "hps") {
                    devicesData.push({
                        sn: sn,
                        data: devices[sn],
                    });

                    data.push({
                        plantid: key,
                        data: {
                            ...rest,
                            devicesData
                        }
                    })
                } else {
                    console.log("Inverter not yet supported. Please log a call at module Github page, https://github.com/mumblebaj/MMM-Growatt/issues")
                }
            });
        })

        return plantDataFiltered;
    },

    getGrowattData: async function (payload) {

        const server = payload.usServer ? servers.us : servers.main;

        const growatt = new api({server: server})

        let login = await growatt.login(payload.username, payload.password).catch(e => {
            console.log(e)
        })
        console.log('MMM-Growatt-Stats login: ', login)

        let getAllPlantData = await growatt.getAllPlantData(options).catch(e => {
            console.log(e)
        })

        let logout = await growatt.logout().catch(e => {
            console.log(e)
        })
        console.log('MMM-Growatt-Stats logout:', logout)

        var plantData = getAllPlantData;

        var parserResponse = this.deconstructPlantData(plantData, payload)

        var growattDataParsed = plantDataFiltered;

        this.sendSocketNotification('GROWATT_STATS_DATA', growattDataParsed)
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === 'GET_GROWATT_STATS_DATA') {
            this.getGrowattData(payload)
        }
    }
})
