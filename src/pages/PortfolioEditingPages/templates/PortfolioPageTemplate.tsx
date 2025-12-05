import { FC, ReactNode } from 'react';
import { Box, Button, Container, Divider, Typography } from '@mui/material';
import styles from './PortfolioPageTemplate.module.css';

export interface PortfolioPageTemplateProps {
    title: string;
    subTitle?: string;
    rightToolBarButton: ReactNode;
    tabs: ReactNode;
    tabContent: ReactNode;
    onCancel?: () => void;
}

export const PortfolioPageTemplate: FC<PortfolioPageTemplateProps> = ({
    title,
    subTitle,
    rightToolBarButton,
    tabs,
    tabContent,
    onCancel,
}) => {
    return (
        <Box
            className={styles.root}
            display="flex"
            flexDirection="column"
        >
            <Container>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    py={3}
                    gap={3}
                    alignItems="center"
                >
                    <Box
                        display="flex"
                        alignItems="baseline"
                        gap={1}
                    >
                        <Typography
                            variant="h1"
                            data-testid="create-portfolio-title"
                        >
                            {title}
                        </Typography>
                        {subTitle && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                data-testid="edit-duplicate-portfolio-locations-qty"
                            >
                                {subTitle}
                            </Typography>
                        )}
                    </Box>
                    <Box
                        display="flex"
                        gap={2}
                    >
                        {onCancel && (
                            <Button
                                variant="outlined"
                                onClick={onCancel}
                                data-testid="create-edit-portfolio-cancel-button"
                            >
                                Cancel
                            </Button>
                        )}
                        {rightToolBarButton}
                    </Box>
                </Box>
            </Container>
            <Box>
                <Divider />
                <Container sx={{ display: 'flex' }}>
                    <Divider
                        orientation="vertical"
                        flexItem
                    />
                    {tabs}
                </Container>
                <Divider />
            </Box>
            {tabContent}
        </Box>
    );
};
