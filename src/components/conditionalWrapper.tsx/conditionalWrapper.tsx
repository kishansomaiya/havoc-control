/**
 *
 * @param {Boolean} condition
 * A boolean that controls whether or not to wrap a component
 * @param {function} wrapper
 * A function that returns a wrapped variant of your component
 *
 * @example
 * <ConditionalWrapper
 *      condition={tooltip}
 *      wrapper={(children) => <Tooltip title={tooltip}>{children}</Tooltip>}
 * >
 *      <Button>GO!</Button>
 * </ConditionalWrapper>
 *
 * @returns A conditionally wrapped component
 */

import type { JSX } from 'react';

interface ConditionalWrapperProps {
    condition: boolean;
    wrapper: (children: React.ReactNode) => JSX.Element;
    children: React.ReactNode;
}

const ConditionalWrapper = ({ condition, wrapper, children }: ConditionalWrapperProps) => {
    return condition ? wrapper(children) : children;
};

export default ConditionalWrapper;
