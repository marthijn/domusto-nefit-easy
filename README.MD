# Nefit Easy

```
plugin:    Nefit Easy
author:    Marthijn van den Heuvel
           Bas van Dijk
category:  heating
version:   0.0.1
website:   http://domusto.com
```

## Hardware needed
- Nefit ModuLine Easy thermostat

## Tested with
- Nefit ModuLine Easy thermostat

## Installation

Execute in the domusto-server folder:
```sh
$ ./domusto.js plugin add marthijn/nefit-easy
```

## Configuration

```js
{
    id: 'NEFIT-EASY',
    enabled: true,
    dummyData: false,
    debug: false,
    settings: {
        pollInterval: 60 * 60 * 1000, // once per hour
        serialNumber: 'SERIALNUMBER',
        accessKey: 'ACCESSKEY',
        password: 'PASSWORD'
    }
}
```

## Example controls 

```js

// For in house temperature
{
    id: 'TEMP9',
    screens: ['weather'],
    enabled: true,
    role: 'input',
    name: 'NEFIT in house',
    type: 'temperature',
    subType: 'temperature',
    plugin: {
        id: 'NEFIT-EASY',
        deviceId: 'in-house-temperature'
    }
},

// For outdoor temperature
{       
    id: 'TEMP10',
    screens: ['weather'],
    enabled: true,
    role: 'input',
    name: 'NEFIT outdoor',
    type: 'temperature',
    subType: 'temperature',
    plugin: {
        id: 'NEFIT-EASY',
        deviceId: 'outdoor-temperature'
    }

},
```