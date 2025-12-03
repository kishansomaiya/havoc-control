import { Box, List as MuiList, Typography } from '@mui/material'
import { ListItem, type RowInfo } from './listItem'

interface Props {
  rows: RowInfo[]
  title?: string
}

/**
 * List - A container component for displaying selectable list items with single or multi-select functionality
 *
 * Provides a standardized list interface with support for both single and multi-select modes,
 * consistent styling, and empty state handling. Uses MUI List components with custom styling
 * and integrates with ListItem components for individual row rendering.
 *
 * @example
 * ```tsx
 * // Basic usage with single select
 * <List
 *   rows={vehicleRows}
 *   title="Vehicles"
 *   onSingleSelect={(id, selectedRows) => {
 *     console.log('Selected vehicle:', id, selectedRows)
 *   }}
 * />
 *
 * // Multi-select mode
 * <List
 *   rows={contactRows}
 *   title="Contacts"
 *   onMultiSelect={(id, allSelectedRows) => {
 *     console.log('All selected contacts:', allSelectedRows)
 *   }}
 * />
 *
 * // With custom row data
 * const rows = [
 *   {
 *     id: '1',
 *     name: 'Vehicle Alpha',
 *     subLabel: 'Status: Active',
 *     icon: <VehicleIcon />,
 *     onClick: () => handleVehicleClick('1')
 *   },
 *   {
 *     id: '2',
 *     name: 'Vehicle Beta',
 *     subLabel: 'Status: Inactive',
 *     icon: <VehicleIcon />,
 *     selected: true
 *   }
 * ]
 *
 * <List
 *   rows={rows}
 *   title="Fleet Vehicles"
 *   onSingleSelect={handleVehicleSelection}
 * />
 * ```
 *
 * @param rows - Array of RowInfo objects containing data for each list item
 * @param title - Optional title used for empty state message and context
 * @param onSingleSelect - Optional callback for single-select mode (replaces previous selection)
 * @param onMultiSelect - Optional callback for multi-select mode (accumulates selections)
 *
 * @returns JSX.Element - List container with items or empty state message
 *
 * @see ListItem - Component used to render individual list items
 * @see RowInfo - Interface defining the structure of list item data
 * @see ListSearch - Component commonly used with List for filtering functionality
 *
 * @note The component maintains internal state for selected rows and handles the selection
 * logic differently based on whether onSingleSelect or onMultiSelect is provided.
 * Single-select mode replaces the previous selection, while multi-select mode accumulates
 * selections. The component renders an empty state message when no rows are provided.
 */

export const List = ({ rows, title }: Props) => {
  return rows?.length > 0 ? (
    <MuiList sx={{ backgroundColor: 'var(--surface-color)', px: 2, py: 0 }}>
      {rows.map((row) => (
        <ListItem key={row.id} info={row} />
      ))}
    </MuiList>
  ) : (
    // box prevents text from overflowing the search bar
    <Box sx={{ position: 'relative', height: '100%' }}>
      <Typography
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {title ? `No ${title} found.` : 'No items found.'}
      </Typography>
    </Box>
  )
}
