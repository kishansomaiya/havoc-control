import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { getVirtuosoTableComponents } from './VirtuosoTable';

describe('getVirtuosoTableComponents', () => {
    it('returns components rendering an empty placeholder with provided colSpan', () => {
        const comps = getVirtuosoTableComponents(3);
        const { EmptyPlaceholder, Table, TableHead, Scroller } = comps;

        render(
            <div>
                {Scroller && <Scroller />}
                {Table && (
                    <Table>
                        {TableHead && <TableHead />}
                        {EmptyPlaceholder && <EmptyPlaceholder />}
                    </Table>
                )}
            </div>
        );

        expect(
            screen.getByText('No results match your search criteria')
        ).toBeInTheDocument();
        const cell = screen
            .getByText('No results match your search criteria')
            .closest('td');
        expect(cell).toHaveAttribute('colspan', '3');
    });
});
