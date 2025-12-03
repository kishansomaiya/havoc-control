import React from 'react'
import { Box, ListItemButton, ListItemIcon, ListItemText, ListItem as MuiListItem, styled } from '@mui/material'
import { ChevronRight } from '@carbon/icons-react'

const AdditionalItemInfoContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  min-width: 0;
  width: 170px;
  p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

/**
 * RowInfo - Interface defining the structure of data for list items
 *
 * @property id - Unique identifier for the list item (optional)
 * @property name - Primary display text for the list item
 * @property subLabel - Secondary text displayed below the primary name (optional)
 * @property selected - Whether the item is currently selected (optional)
 * @property icon - React node to display as the item icon (optional)
 * @property onClick - Click handler function for the item (optional)
 * @property onClickDisabled - Whether the click handler should be disabled (optional)
 * @property additionalItem - Additional React node to display on the right side (optional)
 */
export interface RowInfo {
  id?: string | null
  name: string
  subLabel?: string
  selected?: boolean
  icon?: React.ReactNode
  onClick?: ((val?: string) => void) | null
  onClickDisabled?: boolean
  additionalItem?: React.ReactNode
}

interface ActionRowProps {
  info: RowInfo
}

/**
 * ListItem - A component for rendering individual list items with consistent styling and interactions
 *
 * Provides a standardized list item interface with icon support, primary/secondary text,
 * click handling, selection state, and optional additional content. Uses MUI ListItem
 * components with custom styling for consistent appearance across the application.
 *
 * @example
 * ```tsx
 * // Basic usage with name and icon
 * <ListItem
 *   info={{
 *     id: '1',
 *     name: 'Vehicle Alpha',
 *     icon: <VehicleIcon />,
 *     onClick: () => handleVehicleClick('1')
 *   }}
 * />
 *
 * // With sublabel and selection state
 * <ListItem
 *   info={{
 *     id: '2',
 *     name: 'Contact Beta',
 *     subLabel: 'Last seen: 2 hours ago',
 *     icon: <ContactIcon />,
 *     selected: true,
 *     onClick: () => handleContactClick('2')
 *   }}
 * />
 *
 * // With additional content
 * <ListItem
 *   info={{
 *     id: '3',
 *     name: 'Zone Gamma',
 *     icon: <ZoneIcon />,
 *     additionalItem: <StatusIndicator status="active" />,
 *     onClick: () => handleZoneClick('3')
 *   }}
 * />
 *
 * // Disabled click handler
 * <ListItem
 *   info={{
 *     id: '4',
 *     name: 'Inactive Item',
 *     icon: <InactiveIcon />,
 *     onClick: () => handleClick('4'),
 *     onClickDisabled: true
 *   }}
 * />
 * ```
 *
 * @param info - RowInfo object containing all data and configuration for the list item
 * @param handleSelect - Optional callback for handling item selection (used by parent List component)
 *
 * @returns JSX.Element - List item with consistent styling and interaction handling
 *
 * @see List - Parent component that uses ListItem for rendering list items
 * @see RowInfo - Interface defining the structure of list item data
 * @see ChevronRight - Icon component used to indicate clickable items
 *
 * @note The component uses a fixed height of 69px for consistent list appearance.
 * Icons are constrained to a maximum height of 36px and centered within a 44px minimum width.
 * The component prevents event propagation on click to avoid conflicts with parent handlers.
 * Selected items display with bold font weight (800) while unselected items use normal weight (500).
 */

export const ListItem = ({ info }: ActionRowProps) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    info?.onClick?.()
  }

  return (
    <MuiListItem className='list-item' divider disablePadding sx={{ height: 69 }}>
      <ListItemButton
        className={`list-item__button ${info.name.replace(/\s+/g, '-').toLowerCase()}`}
        data-testid={`list-item-button`}
        onClick={info?.onClick ? handleClick : undefined}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'none', // prevents flash of the list item when hovering on each rerender
          py: 1,
          px: 1.5,
          height: '100%',
          '&:hover': {
            cursor: info?.onClickDisabled || !info?.onClick ? 'default' : 'pointer',
          },
        }}
      >
        {info?.icon && (
          <ListItemIcon
            className='list-item__icon'
            data-testid={`list-item-icon`}
            sx={{
              borderBottom: 'none',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 44,
              '& img': {
                maxHeight: 36,
              },
            }}
          >
            {info?.icon}
          </ListItemIcon>
        )}

        <ListItemText
          className='list-item__text'
          data-testid={`list-item-text`}
          primary={info.name}
          secondary={info?.subLabel || null}
          sx={{
            maxWidth: 'calc(100% - 80px)',
            marginRight: '16px',
            pl: 1,
            '& .MuiListItemText-primary': {
              fontSize: 14,
              lineHeight: '20px',
              fontWeight: info?.selected ? 800 : 500,
            },
            '& .MuiListItemText-secondary': {
              fontSize: 12,
            },
          }}
          title={info.name}
        />

        {info?.additionalItem && 
          <AdditionalItemInfoContainer className='list-item__additional-info' data-testid={`list-item-additional-info`}>
            {info?.additionalItem}
          </AdditionalItemInfoContainer>
        }

        {info?.onClick && 
          <ChevronRight className='open-details-button' style={{ flexShrink: 0, width: 16, height: 16}} />
        }
      </ListItemButton>
    </MuiListItem>
  )
}
