window.TreeAPI.getData()
  .then(res => {
    return res.data.reduce((acc, elem, index, array) => {
      const node = elem;
      node['isChildren'] = array.some(obj => {
        return node.id === obj.parent;
      });

      return [...acc, node];
    }, []);
  })
  .then(res => {
    drawTree(res);
    return;
  })
  .then(res => {
    drawHorizontalLines();
  });

const tree = document.getElementById('tree');

createNode = obj => {
  const isParent = !!obj.parent;
  const id = obj.id;
  const parentId = obj.parent;

  const node = document.createElement('div');
  const nodeText = document.createElement('p');

  node.className = `node node-${id}`;

  nodeText.style.width = randomWidthNode();
  nodeText.className =
    obj.isChildren && isParent
      ? 'line-down line-up'
      : obj.isChildren
      ? 'line-down'
      : isParent
      ? 'line-up'
      : '';
  nodeText.innerHTML = id;

  node.appendChild(nodeText);

  if (isParent) {
    const container = document.querySelector(`.child-container-${parentId}`);

    if (container) {
      container.appendChild(node);
    } else {
      const parentContainer = document.createElement('div');
      parentContainer.className = `child-container child-container-${parentId}`;
      parentContainer.appendChild(node);

      document.querySelector(`.node-${parentId}`).appendChild(parentContainer);
    }
  } else {
    tree.appendChild(node);
  }
};

createSVGElement = (x1, x2, container) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.x1.baseVal.value = x1;
  line.x2.baseVal.value = x2;
  line.style = 'stroke:rgb(0,0,0);stroke-width:3';

  svg.appendChild(line);
  container.appendChild(svg);
};

drawHorizontalLines = () => {
  const containers = document.querySelectorAll('.child-container');

  containers.forEach(elem => {
    if (elem.childNodes.length > 1) {
      const lastElem = elem.childNodes[elem.childNodes.length - 1];
      const firstElem = elem.childNodes[0];

      const startPoint = firstElem.clientWidth / 2;
      var endPoint =
        firstElem.parentNode.clientWidth - lastElem.clientWidth / 2;

      createSVGElement(startPoint, endPoint, elem);
    }
  });
};

updateHorizontalLines = () => {
  const containers = document.querySelectorAll('.child-container');
  containers.forEach(elem => {
    if (elem.childNodes.length > 1) {
      elem.removeChild(elem.childNodes[elem.childNodes.length - 1]);
    }
  });

  drawHorizontalLines();
};

randomWidthNode = () => {
  return Math.floor(Math.random() * 150 + 50) + 'px';
};

deleteNode = event => {
  if (event.target.tagName === 'P') {
    const node = event.target.parentNode;
    const container = event.target.parentNode.parentNode;
    const lineElement = container.childNodes[container.childNodes.length - 1];

    node.remove(node);

    if (container.childNodes.length < 3 && lineElement.tagName === 'svg') {
      container.removeChild(lineElement);
    }

    if (!container.childNodes.length) {
      container.previousSibling.classList.remove('line-down');
    }

    updateHorizontalLines();
  }
};

tree.addEventListener('click', deleteNode);

drawTree = data => {
  data.forEach(elem => {
    createNode(elem);
  });
};
