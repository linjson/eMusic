let Colors = require('material-ui/lib/styles/colors');
let ColorManipulator = require('material-ui/lib/utils/color-manipulator');
let Spacing = require('material-ui/lib/styles/spacing');


//Spacing.desktopKeylineIncrement=40;



module.exports = {
    spacing: {
        ...Spacing,
        desktopKeylineIncrement:40,
        iconSize:20
    },
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: Colors.cyan500,
        primary2Color: Colors.cyan700,
        primary3Color: Colors.cyan100,
        accent1Color: Colors.pinkA200,
        accent2Color: Colors.pinkA400,
        accent3Color: Colors.pinkA100,
        textColor: Colors.darkBlack,
        canvasColor: Colors.white,
        borderColor: Colors.grey300,
        disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
        alternateTextColor: Colors.white,

    },


};