import * as React from 'react';
import matchAllIterator from './match-all-iterator';
import matchQueryIterator from './match-query-iterator';

const concatTextContent = (iterator: TreeWalker): string => {
	let allText = '';
	let currentNode;
	while (currentNode = iterator.nextNode()) {
		allText = `${allText}${currentNode.textContent}`;
	}
	return allText;
};

// ToDo add props and state interfaces


const findStartNodeIndices = (text: string, query: string) => {
	text = text.toLowerCase();
	const indices = [];
	let i = -1;

	while ((i = text.indexOf(query, i+1)) != -1) {
		indices.push(i);
	}

	return indices;
};

class HireHighlighter extends React.Component<any, null> {
	private highlightElements = [];
	private hlClassName = 'hi';
	private hlNodeName = 'span';
	private idAttribute = 'data-id';
	private node;

	public constructor(props) {
		super(props);

		if (props.hlClassName != null) this.hlClassName = props.hlClassName;
		if (props.hlNodeName != null) this.hlNodeName = props.hlNodeName;
		if (props.idAttribute != null) this.idAttribute = props.idAttribute;
	}

	public componentDidMount() {
		let { milestones, query } = this.props;
		const {
			endNodeSelector,
			onChange,
			startNodeSelector,
		} = this.props;

		const highlightElements = [];
		// ToDo change to highlightQuery
		const highlightAll = query === undefined;
		const highlightBetween = startNodeSelector !== null && endNodeSelector != null;

		if (query != null) {
			query = query.toLowerCase();
			if (query.length === 1) milestones = false;
		}

		const t0 = performance.now();
		if (milestones) {
			const iterator = matchAllIterator(this.node);
			const text = concatTextContent(iterator);
			const startNodeIndices = findStartNodeIndices(text, query);
			const endNodeIndices = startNodeIndices.map((i) => i + query.length);
			const iterator2 = matchAllIterator(this.node);
			this.addMilestones(iterator2, startNodeIndices, endNodeIndices);
			this.highlightBetweenSelectors(`.hi-start`, `.hi-end`);
		} else if (highlightAll && highlightBetween) {
			this.highlightBetweenSelectors(startNodeSelector, endNodeSelector);
		} else if (highlightAll) {
			const iterator = matchAllIterator(this.node);
			this.wrapTextNodes(iterator);
		} else {
			const iterator = matchQueryIterator(query, this.node);
			this.wrapQuery(iterator, query);
		}

		const t1 = performance.now();
		console.log(`Perf: ${t1 - t0}`);

		if (onChange != null) onChange(highlightElements);
	}

	private highlightBetweenSelectors(startNodeSelector: string, endNodeSelector: string) {
		const startNodes = this.node.querySelectorAll(startNodeSelector);
		Array.from(startNodes).forEach((startNode: HTMLElement) => {
			const id = startNode.getAttribute(this.idAttribute);
			const endNode = this.node.querySelector(`${endNodeSelector}[${this.idAttribute}="${id}"]`);
			const iterator = matchAllIterator(startNode, endNode);
			this.wrapTextNodes(iterator);
		});
	}

	private wrapTextNodes(iterator) {
		let currentNode;

		while (currentNode = iterator.nextNode()) {
			const textRange = document.createRange();
			textRange.selectNode(currentNode);
			const el = this.createHighlightElement();
			textRange.surroundContents(el);
			this.highlightElements.push(el);
		}
	}

	private wrapQuery(iterator, query) {
		let currentNode;
		while (currentNode = iterator.nextNode()) {
			const textRange = document.createRange();

			if (query != null) {
				const start = currentNode.textContent.toLowerCase().indexOf(query);
				const end = start + query.length;
				textRange.setStart(currentNode, start);
				textRange.setEnd(currentNode, end);
			}

			if (!textRange.collapsed) {
				const el = this.createHighlightElement();
				textRange.surroundContents(el);
				iterator.nextNode();
				this.highlightElements.push(el);
			}
		}
	}

	private addMilestones(iterator: TreeWalker, startIndices: number[], endIndices: number[]) {
		let textLength = 0;
		let currentNode;
		let startIndexIndex = 0;
		let endIndexIndex = 0;
		let startIndex = startIndices[startIndexIndex];
		let endIndex = endIndices[endIndexIndex];

		while (currentNode = iterator.nextNode()) {
			if (
				startIndex >= textLength &&
				startIndex <= textLength + currentNode.textContent.length
			) {
				const textRange = document.createRange();
				textRange.setStart(currentNode, startIndex - textLength);
				const node = this.createMilestone(`ms-${startIndexIndex}`, true);
				textRange.insertNode(node);
				startIndex = startIndices[++startIndexIndex];
			}

			if (
				endIndex >= textLength &&
				endIndex <= textLength + currentNode.textContent.length
			) {
				const textRange = document.createRange();
				textRange.setStart(currentNode, endIndex - textLength);
				const node = this.createMilestone(`ms-${endIndexIndex}`);
				textRange.insertNode(node);
				endIndex = endIndices[++endIndexIndex];
			}

			textLength += currentNode.textContent.length;
		}
	}

	// private wrapQueries(iterator: TreeWalker, startNodeIndices: number[], query: string) {
	// 	let textLength = 0;
	// 	let currentNode;
	//
	// 	const milestones = startNodeIndices.map((index) => ({
	// 		endNode: this.createMilestone(false),
	// 		endNodeIndex: index + query.length,
	// 		startNode: this.createMilestone(),
	// 		startNodeIndex: index,
	// 	}));
	//
	// 	while (currentNode = iterator.nextNode()) {
	// 		const startNodeIndex = startNodeIndices[0];
	// 		const endNodeIndex =startNodeIndex + query.length;
	//
	// 		if (
	// 			startNodeIndex > textLength &&
	// 			startNodeIndex < textLength + currentNode.textContent.length
	// 		) {
	// 			const textRange = document.createRange();
	// 			textRange.setStart(currentNode, startNodeIndex - textLength);
	// 			textRange.insertNode(this.createHighlightElement());
	// 			startNodeIndices.shift();
	// 		}
	//
	// 		if (
	// 			endNodeIndex > textLength &&
	// 			endNodeIndex < textLength + currentNode.textContent.length
	// 		) {
	// 			const textRange = document.createRange();
	// 			textRange.setStart(currentNode, endNodeIndex - textLength);
	// 			textRange.insertNode(this.createHighlightElement());
	// 		}
	//
	// 		textLength += currentNode.textContent.length;
	// 		console.log(startNodeIndex, textLength, currentNode.textContent, currentNode.textContent.length);
	// 	}
	// }

	private createHighlightElement() {
		const el = document.createElement(this.hlNodeName);
		el.className = this.hlClassName;
		return el;
	}

	private createMilestone(id: string, start: boolean = false) {
		const el = document.createElement('a');
		const suffix = start ? 'start' : 'end';
		el.className = `${this.hlClassName}-${suffix}`;
		el.setAttribute(this.idAttribute, id);
		return el;
	}

	public render() {
		const className = (this.props.className != null) ?
			this.props.className :
			'hire-highlighter';

		return (
			<div
				className={className}
			  ref={(node) => { this.node = node }}
			>
				{this.props.children}
			</div>
		);
	}
}

export default HireHighlighter;
