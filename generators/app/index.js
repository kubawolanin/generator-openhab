'use strict';
const chalk = require('chalk');
const Generator = require('yeoman-generator');
const s = require('underscore.string');
const i18n = require('i18n');
const yosay = require('yosay');

/**
 * i18n definitions
 */
let languages = [
  { name: 'English', value: 'en' },
  { name: 'Polish', value: 'pl' }
];

/**
 * Structure definitions
 */
let floors = [
  { name: 'GF', value: 'GroundFloor', icon: 'groundfloor' },
  { name: 'F1', value: 'FirstFloor', icon: 'firstfloor' },
  { name: 'F2', value: 'SecondFloor', icon: 'attic' },
  { name: 'F3', value: 'ThirdFloor', icon: 'attic' },
  { name: 'F4', value: 'FourthFloor', icon: 'attic' }
];

let rooms = [
  { value: 'Attic', icon: 'attic' },
  { value: 'Balcony', icon: '' },
  { value: 'Basement', icon: 'cellar' },
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
  { value: 'Loft', icon: 'attic' },
  { value: 'Lounge', icon: 'sofa' },
  { value: 'MasterBathroom', icon: '' },
  { value: 'MasterBedroom', icon: 'bedroom_red' },
  { value: 'NannyRoom', icon: 'woman_1' },
  { value: 'Office', icon: 'office' },
  { value: 'Outdoor', icon: 'garden' },
  { value: 'Porch', icon: 'group' },
  { value: 'SecondBathroom', icon: '' },
  { value: 'SecondBedroom', icon: 'bedroom_orange' },
  { value: 'Stairwell', icon: '' },
  { value: 'StorageRoom', icon: 'suitcase' },
  { value: 'Studio', icon: '' },
  { value: 'Toilet', icon: 'toilet' },
  { value: 'Terrace', icon: 'terrace' }
];

let devices = [
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

/**
 * Initial prompting
 */
const initPrompts = [{
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
  validate: function (value) {
    var valid = !isNaN(parseFloat(value)) && value <= 5 && value > 0;
    return valid || 'Please enter a number lower than six.';
  }
},

  // {
  //   type: 'input',
  //   name: 'typeOrSelectRooms',
  //   message: 'Would you like to choose the rooms from the list or type them yourself?',
  //   default: ''
  // }
];

let roomsTemplate = {
  type: 'checkbox',
  choices: rooms,
  default: [
    'Bathrom',
    'Bedroom',
    'Dining',
    'Kitchen',
    'Living',
    'Office'
  ]
};

let devicesTemplate = {
  type: 'checkbox',
  name: 'roomSensors',
  choices: (answers) => {
    return devices.map(device => {
      let pluralVal = device.noPlural ? device.value : device.value + 's';
      return {
        name: i18n.__(device.value),
        pluralName: i18n.__(pluralVal),
        value: device.value,
        pluralValue: pluralVal,
        icon: device.icon,
        type: device.type
      }
    })
  }
};

let structure = [];
let floorsPrompts = [];
let roomsPrompts = [];

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    i18n.configure({
      locales: languages.map(lang => lang.value),
      directory: this.sourceRoot() + '/i18n',
      register: global
    });
  }

  /**
   * Ask for initial things like the language
   * and number of floors.
   * Additionally prepare a dynamic list of rooms to be chosen
   * for each floor.
   */
  prompting() {
    this.log(yosay(
      'Welcome to the ' + chalk.yellow('open') + chalk.red('HAB') + ' generator! \n' +
      'Let\'s design your home automation system.'
    ));

    return this.prompt(initPrompts).then((answers) => {
      i18n.setLocale(answers.language);
      this.props = answers;

      rooms = rooms.map(room => {
        return {
          name: i18n.__(room.value),
          value: room.value,
          icon: room.icon
        }
      });

      let floorsCount = +answers.floorsCount;
      for (var i = 0; i < floorsCount; i++) {
        floors[i].rooms = [];
        structure.push(floors[i]);
        let tpl = Object.assign({
          name: floors[i].name + '_rooms',
          message: 'Please select the rooms on ' + floors[i].name
        }, roomsTemplate);
        floorsPrompts.push(tpl);
      }
    });
  }

  /**
   * Ask for rooms on each floor
   * Additionally prepare a dynamic list of devices to be chosen
   * for each room.
   */
  prompting2() {
    return this.prompt(floorsPrompts).then((answers) => {
      structure.forEach(function (floor, index) {
        let roomList = answers[floor.name + '_rooms'].map((room) => {
          return rooms.find(r => { return r.value === room; });
        });

        structure[index].rooms = roomList;

        roomList.forEach(function(room, i) {
          structure[index].rooms[i].devices = [];
          let tpl = Object.assign({
            name: floor.name + '_' + room.name + '_devices',
            message: 'Select smart devices in: ' + room.name + ' on ' + floor.name
          }, devicesTemplate);
          roomsPrompts.push(tpl);
        });
      });
    });
  }

  /**
   * Ask for smart devices in each room
   */
  prompting3() {
    return this.prompt(roomsPrompts).then((answers) => {
      structure.forEach(function (floor, i) {
        floor.rooms.forEach(function(room, j) {
            let name = floor.name + '_' + room.name + '_devices';
            let deviceList = answers[name] ? answers[name].map((device) => {
                return device.find(d => { return d.value === device; });
            }) : [];

            structure[i].rooms[j].devices = deviceList;
        });
      });

      this.props.structure = structure;

      this.log(JSON.stringify(structure, null, '  '));
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
