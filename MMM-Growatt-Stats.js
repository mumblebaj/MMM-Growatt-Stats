Module.register("MMM-Growatt-Stats", {

    defaults: {
        title: "MMM-Growatt-Stats",
        updateInterval: 1000 * 60 * 60,
        username: "username",
        password: "password"
    },

    getStyles: function () {
        return ["MMM-Growatt-Stats.css"]
    },

    getTranslations: function () {

    },

    getTemplate() {

    },

    start: function () {
        Log.info(`Starting module: ${this.name}`);

        suspended = false;

        this.getGrowattStatsData();
        this.scheduleUpdate();
    },

    stop: function () {
        Log.info('Stopping module ' + this.name);
    },

    resume: function () {
        Log.info('Resuming module ' + this.name);
        Log.debug('with config: ' + JSON.stringify(this.config));
        this.suspended = false;
        this.updateStats(this.growattStatsData);
    },

    suspend: function () {
        Log.info('Suspending module ' + this.name);
        this.suspended = true;
    },

    getGrowattStatsData: function () {
        this.sendSocketNotification("GET_GROWATT_STATS_DATA", this.config)
    },

    scheduleUpdate: function (delay) {
        var nextUpdate = this.config.updateInterval
        if (typeof delay != "undefined" && delay >= 0) {
            nextUpdate = delay
        }

        var self = this
        setInterval(function () {
            self.getgrowattStatsData()
        }, nextUpdate)
    },

    socketNotificationReceived: function (notification, payload) {
        var self = this;
        if (notification === "GROWATT_STATS_DATA") {
            this.growattStatsData = payload
            this.updateStats(this.growattStatsData)
        }
    },

    getDom: function () {
        const wrapper = document.createElement("div");
        wrapper.id = "growatt-stats-wrapper";

        return wrapper;
    },

    updateStats: function (growattStatsData) {
        let wrapper = document.getElementById("growatt-stats-wrapper");
        while (wrapper.hasChildNodes()) {
            wrapper.removeChild(wrapper.firstChild);
        }

        // wrapper.id = "growatt-stats-wrapper";
        wrapper.className = "totalPan totalPan3 many";

        const pvout = document.createElement("div")
        pvout.id = "pvout_tab"

        const top_text = document.createElement("div");
        top_text.className = "toptext";
        const img_energy = document.createElement("div")
        img_energy.className = "img img-energy";
        const img_energy_text = document.createElement("span")
        img_energy_text.innerHTML = "Solar"
        img_energy_text.className = "text"

        top_text.appendChild(img_energy)
        top_text.appendChild(img_energy_text)

        const div1 = document.createElement("div")
        div1.className = "gwdiv"
        const half1 = document.createElement("div")
        half1.className = "half"
        const epvOne = document.createElement("span")
        epvOne.className = "val val_epvOne"
        epvOne.innerHTML = this.growattStatsData[0].epvToday
        const unit_box = document.createElement("div")
        unit_box.className = "unitBox"
        const solar_today = document.createElement("p")
        solar_today.className = "text"
        solar_today.innerHTML = "Today"
        const solar_unit = document.createElement("p")
        solar_unit.className = "unit"
        solar_unit.innerHTML = "kWh"
        unit_box.appendChild(solar_today)
        unit_box.appendChild(solar_unit)
        half1.appendChild(epvOne)
        half1.appendChild(unit_box)

        const half2 = document.createElement("div")
        half2.className = "half"
        const epvTwo = document.createElement("span")
        epvTwo.className = "val val_epvTwo"
        let epvtotal = parseFloat(this.growattStatsData[0].epvTotal) / 1000
        epvTwo.innerHTML = parseFloat(epvtotal).toFixed(1)
        const unit_box1 = document.createElement("div")
        unit_box1.className = "unitBox"
        const solar_total = document.createElement("p")
        solar_total.className = "text"
        solar_total.innerHTML = "Total"
        const solar_total_unit = document.createElement("p")
        solar_total_unit.className = "unit"
        if (this.growattStatsData[0].epvTotal >= 1000) {
            solar_total_unit.innerHTML = "MWh"
        } else {
            solar_total_unit.innerHTML = "kWh"
        }
        unit_box1.appendChild(solar_total)
        unit_box1.appendChild(solar_total_unit)

        half2.appendChild(epvTwo)
        half2.appendChild(unit_box1)

        div1.appendChild(half1)
        div1.appendChild(half2)

        pvout.appendChild(top_text)
        pvout.appendChild(div1)

        const div2 = document.createElement("div")
        div2.className = "gwdiv"
        const top_text2 = document.createElement("div")
        top_text2.className = "toptext"
        const img_discharge = document.createElement("div")
        img_discharge.className = "img img-discharge";
        const img_discharge_text = document.createElement("span")
        img_discharge_text.className = "text"
        img_discharge_text.innerHTML = "Discharged"
        top_text2.appendChild(img_discharge)
        top_text2.appendChild(img_discharge_text)

        const div3 = document.createElement("div")
        div3.className = "gwdiv"
        const half3 = document.createElement("div")
        half3.className = "half"
        const storage_out_one = document.createElement("span")
        storage_out_one.className = "val val_storageOutOne"
        storage_out_one.innerHTML = this.growattStatsData[0].eDischargeToday
        const storage_unit_box = document.createElement("div")
        storage_unit_box.className = "unitBox"
        const storage_out_text = document.createElement("p")
        storage_out_text.className = "text"
        storage_out_text.innerHTML = "Today"
        const storage_out_unit = document.createElement("p")
        storage_out_unit.className = "unit"
        storage_out_unit.innerHTML = "kWh"
        storage_unit_box.appendChild(storage_out_text)
        storage_unit_box.appendChild(storage_out_unit)
        half3.appendChild(storage_out_one)
        half3.appendChild(storage_unit_box)

        const half4 = document.createElement("div")
        half4.className = "half"
        const storage_two = document.createElement("span")
        storage_two.className = "val val_storageOutTwo"
        let dischargetotal = parseFloat(this.growattStatsData[0].eDischargeTotal).toFixed(1) / 1000
        storage_two.innerHTML = parseFloat(dischargetotal).toFixed(1)
        const storage_two_box = document.createElement("div")
        storage_two_box.className = "unitBox"
        const storage_two_text = document.createElement("p")
        storage_two_text.className = "text"
        storage_two_text.innerHTML = "Total"
        const storage_two_unit = document.createElement("p")
        storage_two_unit.className = "unit"
        if (this.growattStatsData[0].eDischargeTotal >= 1000) {
            storage_two_unit.innerHTML = "MWh"
        } else {
            storage_two_unit.innerHTML = "kWh"
        }
        storage_two_box.appendChild(storage_two_text)
        storage_two_box.appendChild(storage_two_unit)
        half4.appendChild(storage_two)
        half4.appendChild(storage_two_box)
        div3.appendChild(half3)
        div3.appendChild(half4)

        div2.appendChild(top_text2)
        div2.appendChild(div3)

        const div5 = document.createElement("div")
        div5.className = "gwdiv"
        const toptext3 = document.createElement("div")
        toptext3.className = "toptext"
        const image_charge = document.createElement("div")
        image_charge.className = "img img-charge"
        const charge_text = document.createElement("span")
        charge_text.className = "text"
        charge_text.innerHTML = "Charged"
        toptext3.appendChild(image_charge)
        toptext3.appendChild(charge_text)

        const div6 = document.createElement("div")
        div6.className = "gwdiv"
        const half5 = document.createElement("div")
        half5.className = "half"
        const charge_one = document.createElement("span")
        charge_one.className = "val val_ChargeOne"
        charge_one.innerHTML = parseFloat(this.growattStatsData[0].chargeToday).toFixed(1)
        const charge_one_box = document.createElement("div")
        charge_one_box.className = "unitBox"
        const charge_one_text = document.createElement("p")
        charge_one_text.className = "text"
        charge_one_text.innerHTML = "Today"
        const charge_one_unit = document.createElement("p")
        charge_one_unit.className = "unit"
        charge_one_unit.innerHTML = "kWh"
        charge_one_box.appendChild(charge_one_text)
        charge_one_box.appendChild(charge_one_unit)
        half5.appendChild(charge_one)
        half5.appendChild(charge_one_box)

        const half6 = document.createElement("div")
        half6.className = "half"
        const charge_two = document.createElement("span")
        charge_two.className = "val val_chargeTwo"
        let charge_two_total = parseFloat(this.growattStatsData[0].chargeTotal) / 1000
        charge_two.innerHTML = parseFloat(charge_two_total).toFixed(1)
        const charge_two_box = document.createElement("div")
        charge_two_box.className = "unitBox"
        const charge_two_text = document.createElement("p")
        charge_two_text.className = "text"
        charge_two_text.innerHTML = "Total"
        const charge_two_unit = document.createElement("p")
        charge_two_unit.className = "unit"
        if (this.growattStatsData[0].chargeTotal >= 1000) {
            charge_two_unit.innerHTML = "MWh"
        } else {
            charge_two_unit.innerHTML = "kWh"
        }
        charge_two_box.appendChild(charge_two_text)
        charge_two_box.appendChild(charge_two_unit)
        half6.appendChild(charge_two)
        half6.appendChild(charge_two_box)
        div6.appendChild(half5)
        div6.appendChild(half6)
        div5.appendChild(toptext3)
        div5.appendChild(div6)

        const div7 = document.createElement("div")
        div7.className = "gwdiv"
        const toptext4 = document.createElement("div")
        toptext4.className = "toptext"
        const image_grid = document.createElement("div")
        image_grid.className = "img img-grid"
        const grid_text = document.createElement("span")
        grid_text.className = "text"
        grid_text.innerHTML = "Imported from Grid"
        toptext4.appendChild(image_grid)
        toptext4.appendChild(grid_text)

        div8 = document.createElement("div")
        div8.className = "gwdiv"
        const half7 = document.createElement("div")
        half7.className = "half"
        const grid_one = document.createElement("span")
        grid_one.className = "val val_toGridOne"
        grid_one.innerHTML = this.growattStatsData[0].eToUserToday
        const grid_one_box = document.createElement("div")
        grid_one_box.className = "unitBox"
        const grid_one_text = document.createElement("p")
        grid_one_text.className = "text"
        grid_one_text.innerHTML = "Today"
        const grid_one_unit = document.createElement("p")
        grid_one_unit.className = "unit"
        grid_one_unit.innerHTML = "kWh"
        grid_one_box.appendChild(grid_one_text)
        grid_one_box.appendChild(grid_one_unit)
        half7.appendChild(grid_one)
        half7.appendChild(grid_one_box)

        const half8 = document.createElement("div")
        half8.className = "half"
        const grid_two = document.createElement("span")
        grid_two.className = "val val_toGridTwo"
        grid_two.innerHTML = this.growattStatsData[0].eToUserTotal
        const grid_two_box = document.createElement("div")
        grid_two_box.className = "unitBox"
        const grid_two_text = document.createElement("p")
        grid_two_text.className = "text"
        grid_two_text.innerHTML = "Total"
        const grid_two_unit = document.createElement("p")
        grid_two_unit.className = "unit"
        grid_two_unit.innerHTML = "kWh"
        grid_two_box.appendChild(grid_two_text)
        grid_two_box.appendChild(grid_two_unit)
        half8.appendChild(grid_two)
        half8.appendChild(grid_two_box)
        div8.appendChild(half7)
        div8.appendChild(half8)
        div7.appendChild(toptext4)
        div7.appendChild(div8)

        const div9 = document.createElement("div")
        div9.className = "gwdiv"
        const toptext5 = document.createElement("div")
        toptext5.className = "toptext"
        const img_home = document.createElement("div")
        img_home.className = "img img-home"
        const home_text = document.createElement("span")
        home_text.className = "text"
        home_text.innerHTML = "Load Consumption"
        toptext5.appendChild(img_home)
        toptext5.appendChild(home_text)

        const div10 = document.createElement("div")
        div10.className = "gwdiv"
        const half9 = document.createElement("div")
        half9.className = "half"
        const home_one = document.createElement("span")
        home_one.className = "val val_loadOne"
        home_one.innerHTML = this.growattStatsData[0].useEnergyToday
        const home_one_box = document.createElement("div")
        home_one_box.className = "unitBox"
        const home_one_text = document.createElement("p")
        home_one_text.className = "text"
        home_one_text.innerHTML = "Today"
        const home_one_unit = document.createElement("p")
        home_one_unit.className = "unit"
        home_one_unit.innerHTML = "kWh"
        home_one_box.appendChild(home_one_text)
        home_one_box.appendChild(home_one_unit)
        half9.appendChild(home_one)
        half9.appendChild(home_one_box)

        const half10 = document.createElement("div")
        half10.className = "half"
        const home_two = document.createElement("span")
        home_two.className = "val val_loadTwo"
        home_two.innerHTML = this.growattStatsData[0].useEnergyTotal
        const home_two_box = document.createElement("div")
        home_two_box.className = "unitBox"
        const home_two_text = document.createElement("p")
        home_two_text.className = "text"
        home_two_text.innerHTML = "Total"
        const home_two_unit = document.createElement("p")
        home_two_unit.className = "unit"
        home_two_unit.innerHTML = "kWh"
        home_two_box.appendChild(home_two_text)
        home_two_box.appendChild(home_two_unit)
        half10.appendChild(home_two)
        half10.appendChild(home_two_box)
        div10.appendChild(half9)
        div10.appendChild(half10)
        div9.appendChild(toptext5)
        div9.appendChild(div10)

        wrapper.appendChild(pvout)
        wrapper.appendChild(div2)
        wrapper.appendChild(div5)
        wrapper.appendChild(div7)
        wrapper.appendChild(div9)
        return wrapper;
    }
})