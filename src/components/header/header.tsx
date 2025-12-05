import { Close, ChevronLeft } from '@carbon/icons-react';
import { AppBar, Box, Button, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import ConditionalWrapper from '../conditionalWrapper.tsx/conditionalWrapper';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  onClose?: () => void;
  sx?: object;
}

const Header = ({ title, onBack, onClose, sx }: HeaderProps) => {
  return (
    <AppBar position='static' elevation={0} className='header' sx={sx}>
      <Toolbar sx={{width: '100%', justifyContent: 'space-between', padding: { xs: '0 12px'}}}>
        <Box flexGrow={1}>
          <ConditionalWrapper
            condition={!!onBack}
            wrapper={(children) => (
              <Button
                fullWidth
                variant='text'
                startIcon={<ChevronLeft size={16} />}
                className='header__back-button'
                onClick={onBack}
                sx={{ flexStart: 0, justifyContent: 'flex-start'}}
              >
                <Tooltip title="Back">
                  <span>{children}</span>
                </Tooltip>
              </Button>
            )}
          >
            <Typography sx={{textTransform: 'capitalize'}}>{title}</Typography>
          </ConditionalWrapper>
        </Box>
        {onClose && (
          <IconButton className='header__close-button' onClick={onClose}>
            <Tooltip title="Close">
              <Close size={24} />
            </Tooltip>
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
