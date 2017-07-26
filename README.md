# Yeoman openHAB Generator [![NPM version][npm-image]][npm-url]
> This is a command-line tool that generates openHAB items, sitemap and a [HABPanel](https://github.com/openhab/org.openhab.ui.habpanel) dashboard for your home.
[openHAB](http://openhab.org/) is a vendor and techology agnostic open source automation software for your home.

![openHAB generator](yo-openhab.gif)

With this generator you'll set up your smart home with a least amount of work.
Simply provide some details on how your house is structured:

1. How many floors are in your house
1. Select the rooms on each floor (e.g. `Kitchen`, `Living room` and `Bathroom`)
1. Assign smart devices to each room
1. Done!

As a result this generator will produce an `your-home-name.items` file 
along with `your-home-name.sitemap` and a HABPanel json file that you can later export.

## Installation

First, install [Yeoman](http://yeoman.io) and generator-openhab using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).
If you're using [openHABian](https://github.com/openhab/openhabian), Node.js should be already installed.

```bash
npm i -g yo generator-openhab
```

Then go to your `openhab-config/` folder and generate your files:

```bash
cd /etc/openhab2
yo openhab
```

## License

MIT © [kubawolanin](http://www.kubawolanin.com)

[npm-image]: https://badge.fury.io/js/generator-openhab.svg
[npm-url]: https://npmjs.org/package/generator-openhab
