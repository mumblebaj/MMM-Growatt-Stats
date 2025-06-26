# MMM-Growatt-Stats

A [MagicMirror²](https://magicmirror.builders) module to display Growatt Power Plant Status Data from [Growatt](https://server.growatt.com).

[![Platform](https://img.shields.io/badge/platform-MagicMirror-informational)](https://MagicMirror.builders)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)

<a href="https://www.buymeacoffee.com/mumblebaj" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 45px !important;width: 180px !important;" ></a>

![Example](images/screenshot.png)

## Dependencies
- [growatt](https://www.npmjs.com/package/growatt)
- Requires MagicMirror² v2.23.0. Built and tested on this version. May work on earlier versions but not tested nor supported.
- Requires that you have an account on [Growatt.com](https://server.growatt.com/login)

## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/mumblebaj/MMM-Growatt-Stats.git
````
````
cd MMM-Growatt-Stats
npm install
````

Add the module to the modules array in the `config/config.js` file:
````javascript
        {
            module: "MMM-Growatt-Stats",
            position: "middle_center", //Works best at middle_center. May not display all that well in other positions
            disabled: false,
            config: {
                username: "username",
                password: "password",
                usServer: true, // only used by US Registered users
                mode: "dual", // Specify 'dual' when running https://github.com/mumblebaj/MMM-Growatt.git and https://github.com/mumblebaj/MMM-Growatt-Stats.git together else specify 'single'
                debug: true, // Set to create a log of all data returned from Inverter
                updateInterval: 1000*60*30 //Update every 30 minutes
                
                        }
        },
````
![Example](images/image-2.png) 

## CSS Changes
You can apply your own styling for the module. 
- Go to `~/MagicMirror/css` and you can add your styling customizations to the custom.css file.
- In custom.css you can add the following to make the text values bigger

````

.MMM-Growatt-Stats .totalPan.many .val {
    font-size: 1.5vw;
}

.MMM-Growatt-Stats .totalPan .text {
    font-size: 20px;
}

````
- To resize the images, add the following to custom.css

````

.MMM-Growatt-Stats .totalPan .toptext .img {
    width: 75px;
    height: 75px;
}

````

## Updating

To update the module to the latest version, use your terminal to go to your MMM-Growatt-Stats module folder and type the following command:

````
cd MMM-Growatt-Stats
git pull
npm install

````
## Change Log

### 2025/06/25 v2.2.0
#### You do not have to upgrade to this latest version unless your current version is no longer working.
- Refactor node_helper code
- Improve logic
- Add new helper functions
- Add a retry for login and getAllPlantData

### 2025/06/10 v2.1.0
- Update growatt module to latest

### 2025/03/02
- Fix tlxh stats

### 2025/02/24
- Add debug logging

### 2024/07/05
- Minor cosmetic changes made to Loadconsumption display. Made font size slightly smaller as it wraps currently with huge amounts

### 2024/07/04
- Update the version of growatt to v0.7.4 as there were some changes on growatt

### 2024/01/27
- Update module to use growatt v 0.7.1

### 2023/08/07
  - Update module to cater for different Inverter types as the different inverter types return different datasets.
- Update Module version to v2

### 2023/08/09
- Add a dual and single mode to allow running [MMM-Growatt](https://github.com/mumblebaj/MMM-Growatt.git) and [MMM-Growatt-Stats](https://github.com/mumblebaj/MMM-Growatt-Stats.git) together.
- Running in dual mode, MMM-Growatt-Stats now get it's data from MMM-Growatt.
- Running in "single" mode the module will make it's own request to the Growatt server

### 2023/09/05
- Had a request from user [ruralbrewer](https://github.com/ruralbrewer) to add support for [https://server-us.growatt.com](https://server-us.growatt.com).
- Users in the US registered on the US Growatt Server are now able to use the module.
- A new Config option  usServer: true must be added to the config/config.js. Users registered on the [https://server.growatt.com](https://server.growatt.com) need not add this option.
