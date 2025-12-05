import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InfoGrid } from './InfoGrid';

describe('InfoGrid', () => {
    it('renders key/value pairs', () => {
        render(
            <InfoGrid
                infoList={[
                    { key: 'Name', value: 'Alice' },
                    { key: 'Email', value: 'alice@x.com' },
                ]}
            />
        );
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('alice@x.com')).toBeInTheDocument();
    });
});
