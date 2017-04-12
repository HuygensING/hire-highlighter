export default (startNode, endNode, commonNode) => {
	const range = document.createRange();

	console.log(startNode, endNode, commonNode);
	if (startNode != null) range.setStartAfter(startNode);
	else range.setStartBefore(commonNode);
	if (endNode != null) range.setEndBefore(endNode);
	else range.setEndAfter(commonNode);

	if (startNode == null && endNode == null) range.selectNode(commonNode);

	const filter = (node: Node) => {
		const r = document.createRange();
		r.selectNode(node);

		const start = r.compareBoundaryPoints(Range.START_TO_START, range);
		const end = r.compareBoundaryPoints(Range.END_TO_START, range);

		return (start === -1 || end === 1) ?
			NodeFilter.FILTER_SKIP:
			NodeFilter.FILTER_ACCEPT;
	};

	filter['acceptNode'] = filter;

	commonNode = (commonNode != null) ?
		commonNode :
		range.commonAncestorContainer;

	return document.createTreeWalker(commonNode, NodeFilter.SHOW_TEXT, <any> filter, false);
}
