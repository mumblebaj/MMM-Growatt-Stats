var NodeHelper = require('node_helper')
var api = require('growatt')

const options = {
    plantData: true, weather: false, totalData: true, statusData: true, deviceData: true,
    deviceType: false, historyLast: true, historyAll: false
}

module.exports = NodeHelper.create({
    requiresVersion: '2.23.0',

    start: function() {
        console.log('Starting node helper for ' + this.name)
    },

    deconstructPlantData: function (keys, deviceSerial, d, payload) {
        plantDataFiltered = [];

        const plantId = keys;
        const loggerId = deviceSerial;

        plantDataFiltered.push({
            "plantName": d[plantId].plantName,
            "country": d[plantId].plantData.country,
            "city": d[plantId].plantData.city,
            "accountName": d[plantId].plantData.accountName,
            "inverterPower": d[plantId].plantData.nominalPower,
            "treesSaved": d[plantId].plantData.tree,
            "coalSaved": d[plantId].plantData.coal,
	        "useEnergyToday": d[plantId].devices[loggerId].totalData.useEnergyToday,
            "useEnergyTotal": d[plantId].devices[loggerId].totalData.useEnergyTotal,
            "chargeToday": d[plantId].devices[loggerId].totalData.chargeToday,
            "chargeTotal": d[plantId].devices[loggerId].totalData.chargeTotal,
            "eDischargeTotal": d[plantId].devices[loggerId].totalData.eDischargeTotal,
            "eDischargeToday": d[plantId].devices[loggerId].totalData.eDischargeToday,
            "eToUserTotal": d[plantId].devices[loggerId].totalData.eToUserTotal,
            "eToUserToday": d[plantId].devices[loggerId].totalData.eToUserToday,
            "epvToday": d[plantId].devices[loggerId].totalData.epvToday,
            "epvTotal": d[plantId].devices[loggerId].totalData.epvTotal
        })
        return plantDataFiltered;
    },

    getGrowattData: async function (payload) {
        let keys = "";
        let deviceSerial = "";
        const growatt = new api({})
        let login = await growatt.login(payload.username, payload.password).catch(e => { console.log(e) })
        console.log('login: ', login)

        let getAllPlantData = await growatt.getAllPlantData(options).catch(e => { console.log(e) })

        let logout = await growatt.logout().catch(e => { console.log(e) })
        console.log('logout:', logout)
        
        // Get the Plant ID here
        keys = Object.keys(getAllPlantData);

        // Get the device serial Number
        keys.forEach(key => {
                let { devices, ...rest } = getAllPlantData[key];
                deviceSerial = Object.keys(devices);
        })

        var plantData = getAllPlantData;

        var parserResponse = this.deconstructPlantData(keys, deviceSerial, plantData, payload)

        var growattDataParsed = plantDataFiltered;

        this.sendSocketNotification('GROWATT_STATS_DATA', growattDataParsed)
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === 'GET_GROWATT_STATS_DATA') {
            this.getGrowattData(payload)
        }
    }
})