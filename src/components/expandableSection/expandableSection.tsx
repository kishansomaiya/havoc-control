import { Box, Collapse, IconButton, Typography, styled } from '@mui/material'
import { ChevronDown } from '@carbon/icons-react'

import type { ReactNode } from 'react'

const StyledSection = styled(Box)`
  border-bottom: var(--border-basic);
`

const SectionHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  cursor: pointer;
`

const Title = styled(Typography)`
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
`

const StyledIconButton = styled(IconButton, { shouldForwardProp: (prop) => prop !== '$isExpanded' })<{
  $isExpanded: boolean
}>`
  transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(0deg)' : 'rotate(180deg)')};
`

interface Props {
  title: string
  isExpanded: boolean
  onToggle: () => void
  children: ReactNode
  subTitle?: number | string
  noPadding?: boolean
}

/**
 * ExpandableSection - A collapsible section component for organizing content in detail views
 *
 * This component renders a collapsible section with a clickable header and animated chevron icon.
 * It's commonly used in detail views to organize information into logical groups, providing
 * a clean and organized interface for displaying complex entity information. The component
 * supports optional count indicators and customizable padding.
 *
 * @component
 * @example
 * ```tsx
 * import ExpandableSection from './ExpandableSection'
 *
 * // Basic usage
 * <ExpandableSection
 *   title="Activity"
 *   isExpanded={isActivityExpanded}
 *   onToggle={() => setIsActivityExpanded(!isActivityExpanded)}
 * >
 *   <InfoBox>
 *     <Typography>Status: Active</Typography>
 *     <Typography>Task: Patrol</Typography>
 *   </InfoBox>
 * </ExpandableSection>
 *
 * // With count indicator
 * <ExpandableSection
 *   title="Boundary Points"
 *   isExpanded={boundary}
 *   onToggle={() => setBoundary(!boundary)}
 *   count={5}
 * >
 *   {boundaryPoints.map(point => (
 *     <Typography key={point.id}>{point.name}</Typography>
 *   ))}
 * </ExpandableSection>
 *
 * // Without padding for custom layouts
 * <ExpandableSection
 *   title="Overview"
 *   isExpanded={overView}
 *   onToggle={() => setOverView(!overView)}
 *   noPadding={true}
 * >
 *   <Box sx={{ padding: 3 }}>
 *     <Typography>Custom content with own padding</Typography>
 *   </Box>
 * </ExpandableSection>
 *
 * // In vehicle details context
 * <ExpandableSection
 *   title='Power'
 *   isExpanded={isPowerExpanded}
 *   onToggle={() => setIsPowerExpanded(!isPowerExpanded)}
 * >
 *   <InfoBox>
 *     <Grid container alignItems='center'>
 *       <Grid item xs={5}>
 *         <Typography className='label'>Battery</Typography>
 *       </Grid>
 *       <Grid item xs={6}>
 *         <Typography className='value'>85%</Typography>
 *       </Grid>
 *     </Grid>
 *   </InfoBox>
 * </ExpandableSection>
 * ```
 *
 * @param {Props} props - Component props
 * @param {string} props.title - The title displayed in the section header
 * @param {boolean} props.isExpanded - Whether the section content is currently expanded
 * @param {() => void} props.onToggle - Callback function called when the header is clicked
 * @param {ReactNode} props.children - Content to render inside the collapsible section
 * @param {number | string} [props.subTitle] - Optional subtitle to display next to the title (e.g., "Boundary Points (5)")
 * @param {boolean} [props.noPadding=false] - Whether to remove default padding from the content area
 *
 * @returns {JSX.Element} A collapsible section with header and animated content
 *
 * @see VehicleDetails - Component that uses ExpandableSection for vehicle information organization
 * @see ContactDetails - Component that uses ExpandableSection for contact information
 * @see SectorDetails - Component that uses ExpandableSection for sector information
 * @see ZoneDetails - Component that uses ExpandableSection for zone information
 * @see TeamDetails - Component that uses ExpandableSection for team information
 *
 * @note The component includes smooth animations for the chevron rotation and content
 * expansion/collapse, and automatically handles border styling for visual separation.
 */

export const ExpandableSection = ({ title, isExpanded, onToggle, children, subTitle, noPadding = false }: Props) => {
  const lowerCaseTitle = title.replace(/\s+/g, '-').toLowerCase()
  return (
    <StyledSection className={`section ${lowerCaseTitle}`} data-testid={`expandable-section-${lowerCaseTitle}`}>
      <SectionHeader onClick={onToggle}>
        <Title data-testid={`expandable-section-title`}>
          {title}
          {subTitle !== undefined && ` (${subTitle})`}
        </Title>

        <StyledIconButton $isExpanded={isExpanded} data-testid={`expandable-section-toggle-button`}>
          <ChevronDown />
        </StyledIconButton>
      </SectionHeader>

      <Collapse in={isExpanded} data-testid={`expandable-section-content`}>
        <Box sx={{ padding: noPadding ? 0 : 2, pb: 2 }}>{children}</Box>
      </Collapse>
    </StyledSection>
  )
}
