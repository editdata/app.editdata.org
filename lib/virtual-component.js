module.exports = Component

function Component (virtualNode, props) {
  if (virtualNode.init) {
    virtualNode.init(props)
  }

  if (virtualNode.render) return virtualNode.render(props)
  return virtualNode(props)
}
