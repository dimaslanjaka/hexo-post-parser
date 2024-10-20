export function nodeListOf2Html(nodes: NodeListOf<Element | HTMLElement>) {
  return Array.prototype.reduce.call(
    nodes,
    function (html, node) {
      return html + (node.outerHTML || node.nodeValue);
    },
    ''
  );
}
