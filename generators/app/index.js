'use strict';
const chalk = require('chalk');
const Generator = require('yeoman-generator');
const s = require('underscore.string');
const i18n = require('i18n');
const yosay = require('yosay');

let languages = [
  { name: 'English', value: 'en' },
  { name: 'Polish', value: 'pl' }
];

let floors = [
  { value: 'GroundFloor', icon: 'groundfloor' },
  { value: 'FirstFloor', icon: 'firstfloor' },
  { value: 'SecondFloor', icon: 'attic' },
  { value: 'ThirdFloor', icon: 'attic' },
  { value: 'FourthFloor', icon: 'attic' }
];

let rooms = [
  { value: 'Attic', icon: 'attic' },
  { value: 'Balcony', icon: '' },
  { value: 'Basement', icon: '' },
  { value: 'Bathroom', icon: 'bath' },
  { value: 'Bedroom', icon: 'bedroom' },
  { value: 'Boiler', icon: 'boiler_viessmann' },
  { value: 'Wardrobe', icon: 'wardrobe' },
  { value: 'Corridor', icon: 'corridor' },
  { value: 'Dining', icon: '' },
  { value: 'ElderlyRoom', icon: '' },
  { value: 'Entrance', icon: 'frontdoor' },
  { value: 'Garage', icon: 'garage' },
  { value: 'Hallway', icon: '' },
  { value: 'HomeCinema', icon: 'television' },
  { value: 'KidRoom1', icon: '' },
  { value: 'KidRoom2', icon: '' },
  { value: 'KidRoom3', icon: '' },
  { value: 'KidsRoom', icon: '' },
  { value: 'Kitchen', icon: 'kitchen' },
  { value: 'LaundryRoom', icon: 'washingmachine' },
  { value: 'Library', icon: 'office' },
  { value: 'Living', icon: 'sofa' },
  { value: 'LivingDining', icon: 'sofa' },
  { value: 'Loft', icon: '' },
  { value: 'Lounge', icon: '' },
  { value: 'MasterBathroom', icon: '' },
  { value: 'MasterBedroom', icon: 'bedroom_red' },
  { value: 'NannyRoom', icon: 'woman_1' },
  { value: 'Office', icon: 'office' },
  { value: 'Outdoor', icon: 'garden' },
  { value: 'Porch', icon: '' },
  { value: 'SecondBathroom', icon: '' },
  { value: 'SecondBedroom', icon: 'bedroom_orange' },
  { value: 'Stairwell', icon: '' },
  { value: 'StorageRoom', icon: 'suitcase' },
  { value: 'Studio', icon: '' },
  { value: 'Toilet', icon: 'toilet' },
  { value: 'Terrace', icon: 'terrace' }
];

let sensors = [
  { value: 'Light', icon: 'light', type: 'Switch:OR(ON, OFF)' },
  { value: 'Window', icon: 'window', type: 'Contact:OR(OPEN, CLOSED)' },
  { value: 'Door', icon: 'door', type: 'Contact:OR(OPEN, CLOSED)' },
  { value: 'Motion', icon: 'motion', type: 'Switch:OR(ON, OFF)' },
  { value: 'Power', icon: 'poweroutlet', type: 'Switch:OR(ON, OFF)', noPlural: true },
  { value: 'Shutter', icon: 'rollershutter', type: 'Switch:OR(ON, OFF)' },
  { value: 'Fan', icon: 'fan_ceiling', type: 'Switch:OR(ON, OFF)' },
  { value: 'AirCon', icon: 'climate', type: 'Switch:OR(ON, OFF)' },
  { value: 'Heating', icon: 'heating', type: 'Number:AVG', noPlural: true },
  { value: 'Temperature', icon: 'temperature', type: 'Number:AVG', noPlural: true },
  { value: 'Humidity', icon: 'humidity', type: 'Number:AVG', noPlural: true },
];

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    i18n.configure({
      locales: languages.map(lang => lang.value),
      directory: this.sourceRoot() + '/i18n',
      register: global
    });
  }

  prompting() {
    this.log(yosay(
      'Welcome to the ' + chalk.yellow('open') + chalk.red('HAB') + ' generator! \n' +
      'Let\'s design your home automation system.'
    ));

    const initPrompts = [
      {
        type: 'list',
        name: 'language',
        message: 'Please select your language',
        choices: languages,
        default: 'en',
        store: true
      },

      {
        type: 'checkbox',
        name: 'filesGenerated',
        message: 'What would you like to generate?',
        choices: [
          { name: 'Items file', value: 'items' },
          { name: 'Sitemap', value: 'sitemap' },
          { name: 'HABpanel Dashboards', value: 'habpanel' }
        ],
        default: ['items', 'sitemap']
      },

      // {
      //   type: 'input',
      //   name: 'typeOrSelectRooms',
      //   message: 'Would you like to choose the rooms from the list or type them yourself?',
      //   default: ''
      // },

      {
        type: 'input',
        name: 'homeName',
        message: 'How do you want to call your home?',
        default: 'Our Home'
      },
      {
        type: 'input',
        name: 'floorsCount',
        message: 'How many floors do you have? (max 5)',
        default: 1,
        validate: function(value) {
            var valid = !isNaN(parseFloat(value)) && value <= 5 && value > 0;
            return valid || 'Please enter a number lower than six.';
        }
      },
      {
      type: 'checkbox',
      name: 'chosenRooms',
      message: 'Please select the rooms on 1 floor',
      choices: rooms,
      default: [
        'Bathrom',
        'Bedroom',
        'Dining',
        'Kitchen',
        'Living',
        'Office'
      ]
    }, {
      type: 'checkbox',
      name: 'roomSensors',
      message: 'What kind of devices/sensors are in the Kitchen?',
      choices: sensors
    }
    ];

    let roomsPrompt = [{
      type: 'checkbox',
      name: 'chosenRooms',
      message: 'Please select the rooms on 1 floor',
      choices: rooms,
      default: [
        'Bathrom',
        'Bedroom',
        'Dining',
        'Kitchen',
        'Living',
        'Office'
      ]
    }];

    let sensorsPrompt = [{
      type: 'checkbox',
      name: 'roomSensors',
      message: 'What kind of devices/sensors are in the Kitchen?',
      choices: sensors
    }];

    return this.prompt(initPrompts)
      .then(props => {
        this.props = props;

        i18n.setLocale(this.props.language);

        if (props.floorsCount > 1) {
            // let roomsPrompt = ''
        }

        this.props.floors = floors.map(floor => {
          return {
            name: i18n.__(floor.value),
            value: floor.value,
            icon: floor.icon
          }
        });

        this.props.rooms = rooms.map(room => {
          return {
            name: i18n.__(room.value),
            value: room.value,
            icon: room.icon
          }
        });

        this.props.sensors = sensors.map(sensor => {
          let pluralVal = sensor.noPlural ? sensor.value : sensor.value + 's';
          return {
            name: i18n.__(sensor.value),
            pluralName: i18n.__(pluralVal),
            value: sensor.value,
            pluralValue: pluralVal,
            icon: sensor.icon,
            type: sensor.type
          }
        });
      });
  }

  writing() {
    let name = s.dasherize(this.props.homeName).substr(1);

    if (this.props.filesGenerated.includes('items')) {
      this.fs.copyTpl(
        this.templatePath('items.ejs'),
        this.destinationPath('items/' + name + '.items'),
        this.props
      );
    }

    if (this.props.filesGenerated.includes('sitemap')) {
      this.fs.copyTpl(
        this.templatePath('sitemap.ejs'),
        this.destinationPath('sitemap/' + name + '.sitemap'),
        this.props
      );
    }

    if (this.props.filesGenerated.includes('habpanel')) {
      this.fs.copyTpl(
        this.templatePath('habpanel.ejs'),
        this.destinationPath('html/' + name + '.json'),
        this.props
      );
    }
  }
};
