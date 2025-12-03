# Delete this file once we've moved all the necessary components over and hooked them up

This file is to indicate what happened to a legacy component, why it happened, and how it is used now. Some of these are also just comments on some components and how we can move towards removing them

## ActionBarButton
What: Leaving this alone for now since there's logic within the styling for it and it doesn't seem like it's easily able to replicate in the theme

Note: We should keep an eye on this when we start redoing our new designs, with so much logic in the css, it seems more logical for the parent of the ActionBarButton to pass in the custom classes or we create a helper function for the logic part and move the static CSS to a button variant in the theme.

## GeoEntityButton
What: Leaving this here since it has nested styling with some conditional based on props. If start normalizing text styling, we can make move towards reducing what's in this file and potentially make a move towards removing the component.

Note: The wrapping box being used solely for padding is something I would like to move away from. Instead, the parent of the component should apply padding to itself and use the gap property to space the children. However, I understand design doesn't always lend itself to this—i.e., some children taking the full width as the display quickly breaks this ideology.

## ButtonToggle and ListToggle
What: Merged together into SwitchButton Component

Whys:
* ButtonToggle was for styling purposes only and never used without the Switch component in the old code
* ListToggle was reading from state variables

How: Refer to the SwitchButton file, but keep note the parent component must now keep track of/pass in the switch state and handle click events

## CloseButton
What: Culled down in props

Why: Props/functions could be handled by the parent. e.g. No need for setActive, parent can handle that on the close function. Class names can be passed as props

How: Same usage, but handle setActive in the close function and pass in the class name/sx styling you want 

## CreateButtonTextVariant
What: Removed and button class added to theme

Why: Only 2 components used it (`TeamListMenu` and `EntitySelectorDropdown`), and what it did isn't complex enough to really warrant its own component. The wrapper for it is unnecessary as we can apply styling to the button directly to get the same effect.

How: Use a MUI `Button` component in its place and pass in the icon of your choice (previous iteration used the `Add` MUI Icon, but you're free now!), the text as the children (also free now to change this as you see fit), and add `button-text-variant` as a class name and it should achieve the same results.

## FlyToButton
What: Still exists since it has specific handling, but part of it is moved to a generalized component

Why: Kept because a number of components used it or should use it in the old App, but branched into a generalized component because an even larger number of components use the Tooltip + IconButton components together in the same fashion

How: Same usage, but pass in `flyToLocation` instead of title now and you can pass in additional props that IconButton can use to customize further as needed

## LinkButton
What: Removed component and added into theme as Button variant

Why: Simplified since it was a component only for styling 

How: Use MUI `Button` component and pass `variant="link"` along with the normal props you would use for a link. Set width and any other custom styles through the sx prop. E.g., `sx={{ width: 200 }}`

## MultiButtonContainer
What: Removed and added as a class in theme

Why: Component was only used for styling purposes. Also, even though it was meant to display the children in a column, every component using it overwrote that style and used it as a row display.

How: Use MUI `Stack` component and pass in the class name `multi-button-container`.

Note: Could potentially move to MUI `Grid` if more responsiveness is needed.

## StyledToggleButtonGroup and StyledToggleButton
What: Removed and added a class in theme. Could even overwrite the root component directly if we want it to be the Havoc Style Default

Why: Largely styling, and the single conditional styling isn't needed. The inherent MUI toggle button can handle most cases, and the rare ones that didn't could be targeted directly.

How: 
* Use MUI `ToggleButtonGroup` in place of `StyledToggleButtonGroup` and pass in the `havoc-toggle-button-group` class if you want the buttons to have that styling. For pretty much all the previous uses of the ToggleButtons, pass in `fullWidth={true}`; this will both handle the previous styling of 100% width and should evenly space the children (which was what the width param was used for previously). If you do somehow get child components that are bigger than their siblings, you can target all of them directly using the `sx` prop and set their width (what the previous component was doing anyway). There used to also be a margin-bottom to give some spacing when used in a menu with other components; we should probably handle that in the parent component of the menu using the `gap` param and using it as a flex or grid CSS component.
* Use MUI `ToggleButton` in place of `StyledToggleButton`.

## ToolButton
What: Removed

Why: After checking out the components that use it, the specialized props in the components were not being used, thus the component is only useful for styling

How: Use MUI `IconButton` in place where it was previously used and pass in the class name `tool-button`
