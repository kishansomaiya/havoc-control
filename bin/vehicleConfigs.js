/**
 * File for all the hardcoded data used by vehicle icons to keep the static data separate from the logic
 */

// Directory path with source files for the vehicles
export const vehicleBaseDirectory = "./src/assets/vehicles/base";

// Directory path for where to put the generated path files
export const vehiclesDistDirectory = "./src/assets/vehicles/dist";

// Color of the path from base SVG image act as identifier
export const colorMapping = {
    "black": "outline",
    "#d10000": "primary",
    "#efd6d6": "secondary",
}

/* Backdrop is all black since it will be the SDF image for changing vehicle color and is the same for all themes */
export const backdropConfig = {
    outline: { color: "black", opacity: 1 },
    primary: { color: "black", opacity: 1 },
    secondary: { color: "black", opacity: 1 }
}

// Image config object to dictate the images we're generating (theme and ship states) and the color/opacity we're setting the svg paths
export const imageThemeConfig = {
    default: { // Light mode
        base: {
            outline: {
                color: "black",
                opacity: 1
            },
            primary: { opacity: 0 },
            secondary: { opacity: .6 }
        },
        selected: {
            outline: {
                color: "black",
                opacity: 1,
            },
            primary: { opacity: 0 },
            secondary: { opacity: .4 }
        }
    },
    "nautical-light": { // These are the same as default atm
        base: {
            outline: {
                color: "black",
                opacity: 1
            },
            primary: { opacity: 0 },
            secondary: { opacity: .6 }
        },
        selected: {
            outline: {
                color: "black",
                opacity: 1,
            },
            primary: { opacity: 0 },
            secondary: { opacity: .4 }
        }
    },
    "nautical-dark": {
        base: {
            outline: {
                color: "black",
                opacity: 1
            },
            primary: { opacity: 0.8 },
            secondary: { opacity: 0 }
        },
        selected: {
            outline: { opacity: 0, },
            primary: { color: "black" },
            secondary: { opacity: 0 }
        }
    }
}
