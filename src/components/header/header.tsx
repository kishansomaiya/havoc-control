import React from 'react';
import { AppBar, Box, Button, styled, Toolbar, Tooltip, Typography } from '@mui/material';
import { ChevronLeft } from '@carbon/icons-react';
import { CloseButton } from '../buttons/closeButton';
import ConditionalWrapper from '../conditionalWrapper.tsx/conditionalWrapper';

const Title = styled(Typography)`
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`

const SubText = styled('span')`
  font-size: 12px;
  font-weight: 400;
  margin-left: 8px;
  color: #ffffff99;
`

const SubTitle = styled(Typography)`
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`

interface TitleContainerProps {
  title: string;
  subText?: string;
  subTitle?: string;
}

const TitleContainer = ({ title, subText, subTitle }: TitleContainerProps) => {
  const titleStyle = { fontSize: subTitle ? '14px' : '18px' }

  return (
    <Box className='title-container' ml={1}>
      <Title style={titleStyle}>
        {title}
        <SubText>{subText}</SubText>
      </Title>
      {subTitle && <SubTitle>{subTitle}</SubTitle>}
    </Box>
  )
}

const RightControl = styled(Box)`
  display: flex;
  align-items: center;

  .MuiIconButton-root {
    width: 44px;
    height: 44px;
    margin-left: 5px;
  }
`

interface HeaderProps {
  title: string;
  subText?: string;
  subTitle?: string;
  onBack?: () => void;
  onClose?: () => void;
  additionalButtons?: React.ReactNode[];
  sx?: object;
}

const Header = ({ title, subText, subTitle, onBack, onClose, additionalButtons, sx }: HeaderProps) => {
  return (
    <AppBar position='static' elevation={0} className='header' sx={sx}>
      <Toolbar sx={{width: '100%', justifyContent: 'space-between', padding: { xs: '0 12px'}}}>
        <Box flexGrow={1} mr={1}>
          <ConditionalWrapper
            condition={!!onBack}
            wrapper={(children) => (
              <Button
                fullWidth
                variant='text'
                startIcon={<ChevronLeft />}
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
            <TitleContainer title={title} subText={subText} subTitle={subTitle} />
          </ConditionalWrapper>
        </Box>
        <RightControl className='header__right-controls' display='flex' alignItems='center'>
          {additionalButtons?.map((button, index) => (
            <React.Fragment key={`additional-button-${index}`}>{button}</React.Fragment>
          ))}
          {onClose && (<CloseButton onClose={onClose} />)}
        </RightControl>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
