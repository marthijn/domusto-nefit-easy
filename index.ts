import util from '../../util';
import config from '../../config';

// DOMUSTO
import DomustoPlugin from '../../domusto/DomustoPlugin';

// INTERFACES
import { Domusto } from '../../domusto/DomustoInterfaces';

// PLUGIN SPECIFIC
import * as NefitEasyCommands from 'nefit-easy-commands';

/**
 * Nefit Easy plugin for DOMUSTO
 * @author Marthijn van den Heuvel
 * @author Bas van Dijk
 * @version 0.0.1
 *
 * @class DomustoNefitEasy
 * @extends {DomustoPlugin}
 */
class DomustoNefitEasy extends DomustoPlugin {

    /**
     * Creates an instance of DomustoNefitEasy.
     * @param {any} Plugin configuration as defined in the config.js file
     * @memberof DomustoNefitEasy
     */
    constructor(pluginConfiguration: Domusto.PluginConfiguration) {

        super({
            plugin: 'Nefit Easy',
            author: 'Marthijn van den Heuvel, Bas van Dijk',
            category: Domusto.PluginCategories.heating,
            version: '0.0.1',
            website: 'http://domusto.com'
        });

        if (pluginConfiguration.dummyData) {

            this.initDummyData();

        } else {

            // Initialize hardware plugin
            this.hardwareInstance = NefitEasyCommands({
                serialNumber: pluginConfiguration.settings.serialNumber,
                accessKey: pluginConfiguration.settings.accessKey,
                password: pluginConfiguration.settings.password
            });

            // Poll current receiver status
            this.refreshNefitEasyStatus();

            // Start polling receiver on interval
            setInterval(() => this.refreshNefitEasyStatus(), pluginConfiguration.settings.pollInterval);
        }
    }

    // Nefit Easy commands documentation: https://github.com/robertklep/nefit-easy-commands
    refreshNefitEasyStatus() {

        this.hardwareInstance.connect().then(() => {
            return [this.hardwareInstance.status(), this.hardwareInstance.pressure(), this.hardwareInstance.location()];
        }).spread((status, pressure, location) => {
            if (this.pluginConfiguration.debug) {
                util.prettyJson(status);
                util.prettyJson(pressure);
                util.prettyJson(location);
            }

            this.broadcastSignal('in-house-temperature', {
                deviceTypeString: 'Nefit Easy in house temperature',
                temperature: status['in house temp'],
            });

            this.broadcastSignal('outdoor-temperature', {
                deviceTypeString: 'Nefit Easy outdoor temperature',
                temperature: status['outdoor temp'],
            });

        }).catch((e) => {
            util.error('Nefit Easy error', e);
        }).finally(() => {
            this.hardwareInstance.end();
        });

    }


    /**
     * Starts emitting dummy data
     *
     * @memberof DomustoNefitEasy
     */
    initDummyData() {

        setInterval(() => {

            let sensorData = this.getStatusDummyData();

            this.broadcastSignal('in-house-temperature', {
                deviceTypeString: 'Nefit Easy in house temperature',
                temperature: sensorData.status['in house temp'],
            });

            this.broadcastSignal('outdoor-temperature', {
                deviceTypeString: 'Nefit Easy outdoor temperature',
                temperature: sensorData.status['outdoor temp'],
            });

        }, 10000);

    }


    /**
     * Gives dummy data for the Nefit Easy
     *
     * @returns Dummy data with randomized temperatures
     * @memberof DomustoNefitEasy
     */
    getStatusDummyData() {
        return {
            status: {
                'user mode': 'clock',
                'clock program': 'auto',
                'in house status': 'ok',
                'in house temp': util.randomWithinOffset(19.2, 4),
                'hot water active': true,
                'boiler indicator': 'central heating',
                control: 'room',
                'temp override duration': 0,
                'current switchpoint': 37,
                'ps active': false,
                'powersave mode': false,
                'fp active': false,
                'fireplace mode': false,
                'temp override': false,
                'holiday mode': false,
                'boiler block': null,
                'boiler lock': null,
                'boiler maintenance': null,
                'temp setpoint': util.randomWithinOffset(19.5, 2),
                'temp override temp setpoint': 17,
                'temp manual setpoint': 19,
                'hed enabled': null,
                'hed device at home': null,
                'outdoor temp': util.randomWithinOffset(13, 5),
                'outdoor source type': 'virtual'
            },
            pressure: {
                pressure: util.randomWithinOffset(2, 0.05),
                unit: 'bar'
            },
            location: {
                lat: 52.197906,
                lng: 5.143669
            }
        };
    }
}
export default DomustoNefitEasy;