 oldVChildren = (Array.isArray(oldVChildren) ? oldVChildren : oldVChildren ? [oldVChildren]).filter(item => item) : [];
 newVChildren = (Array.isArray(newVChildren) ? newVChildren : newVChildren ? [newVChildren]).filter(item => item) : [];
 let keyedOldMap = {};
 let lastPlacedIndex = 0;
 oldVChildren.forEach((oldVChild, index) => {
   let oldKey = oldVChild.key ? oldVChild.key : index;
   keyedOldMap[oldKey] = oldVChild;
 });
 let patch = [];
 newVChildren.forEach((newVChild, index) => {
   newVChild.mountIndex = index;
   let newKey = newVChild.key ? newVChild.key : index;
   let oldVChild = keyedOldMap[newKey];
   if (oldVChild) {
     updateElement(oldVChild, newVChild);
     if (oldVChild.mountIndex < lastPlacedIndex) {
       patch.push({
         type: MOVE,
         oldVChild,
         newVChild,
         mountIndex: index
       });
     }
     delete keyedOldMap[newKey];
     lastPlacedIndex = Math.max(lastPlacedIndex, oldVChild.mountIndex);
   } else {
     patch.push({
       type: PLACEMENT,
       newVChild,
       mountIndex: index
     });
   }
 });
 let moveVChild = patch.filter(action => action.type === MOVE).map(action => action.oldVChild);
 Object.values(keyedOldMap).concat(moveVChild).forEach((oldVChild) => {
   let currentDOM = findDOM(oldVChild);
   parentDOM.removeChild(currentDOM);
 });
 patch.forEach(action => {
   let { type, oldVChild, newVChild, mountIndex } = action;
   let childNodes = parentDOM.childNodes;
   if (type === PLACEMENT) {
     let newDOM = createDOM(newVChild);
     let childNode = childNodes[mountIndex];
     if (childNode) {
       parentDOM.insertBefore(newDOM, childNode);
     } else {
       parentDOM.appendChild(newDOM);
     }
   } else if (type === MOVE) {
     let oldDOM = findDOM(oldVChild);
     let childNode = childNodes[mountIndex];
     if (childNode) {
       parentDOM.insertBefore(oldDOM, childNode);
     } else {
       parentDOM.appendChild(oldDOM);
     }
   }
 });