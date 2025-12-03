# Base folder

This folder holds the base SVG of the vehicles imported from Figma
Images here will be processed through a node script to generate a set of images for each svg that'll be use to handle different color/themed vehicles

# How to use

1. Move any vehicle **SVG**'s you want processed into `src/images/vehicles/base` ([SVG Requirements](#svg-requirements))
2. Use command `yarn create_vehicles`, this will clear out any files/folders in `src/images/vehicles/dist` and then generate a set of images for each vehicle. 
3. Update/Hookup vehicle rendering logic to use these files. The `backdrop.png` file for each vehicle should be rendered as a SDF file and team colors applied to it. Based on the state of the vehicle (selected, hover, etc) and the chosen theme, render the appropriate vehicle image on top

# TODO's ?
1. Hook up the vehicle generation to build process
2. Generate JS/JSON file to be used in the app to reference the vehicles
3. Make sure we're able to render the vehicle icon correctly outside of map library. Might not be needed depending on future design using generic vehicle icons with the team color

# SVG Requirements

Given the strictness of the file parsing, the icons created in Figma need to be structured so that we can properly split, recolor, and reform everything on map library
1. Everything should be in its own Layer/Path and color set with fill, do not use stroke/outline.
2. Do not use a base/background layer for a singular color. The vehicle recoloring in the app will work with a background layer, but the base SVG needs to have paths for each segment, otherwise the generated images will not be correct. (e.g. The small boat has a circle in the center and the light red/white\[#EFD6D6\] base color appears both outside the circle and inside. For this image to be process correctly, the base color layer needs to have circle part cutout so that the SVG path for it has 2 distinct lines)
3. The Parser only reads the SVG paths, so masks or filters will be ignored
4. The color change works with a base color layer and then overlaying another vehicle on top with semi transparent layers. So vehicles and their possible states should be designed with an outline color (black most likely), a base color, and the remaining color is the base color with a semi transparent layer on top with varying opacity numbers based on the state. All designs of the vehicles should use the same paths with different color/transparency values.