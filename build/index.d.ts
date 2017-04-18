/// <reference types="react" />
import * as React from 'react';
declare class HireHighlighter extends React.Component<any, null> {
    private highlightElements;
    private hlClassName;
    private hlNodeName;
    private idAttribute;
    private node;
    constructor(props: any);
    componentDidMount(): void;
    private highlightBetweenSelectors(startNodeSelector, endNodeSelector);
    private wrapTextNodes(iterator);
    private wrapQuery(iterator, query);
    private addMilestones(iterator, indices, start?);
    private createHighlightElement();
    private createMilestone(id, start?);
    render(): JSX.Element;
}
export default HireHighlighter;
