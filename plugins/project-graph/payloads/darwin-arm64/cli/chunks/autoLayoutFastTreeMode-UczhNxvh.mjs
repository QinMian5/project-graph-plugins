import { G as Vector, U as Rectangle, W as Line, et as __decorate, tt as __decorateMetadata } from "./ProjectUpgrader-CJFD-Z4z.mjs";
import { r as service, t as Project } from "./Project-CsxlE7F6.mjs";
import { t as TextNode } from "./TextNode-C6fG2cYN.mjs";
//#region src/core/service/controlService/autoLayoutEngine/autoLayoutFastTreeMode.tsx
var AutoLayoutFastTree = class AutoLayoutFastTree {
	project;
	constructor(project) {
		this.project = project;
	}
	/**
	* 获取当前树的外接矩形，注意不要有环，有环就废了
	* @param node
	* @param skipDashed 是否跳过虚线边（树形格式化时传 true）
	* @returns
	*/
	getTreeBoundingRectangle(node, skipDashed = false) {
		const childRectangle = this.project.graphMethods.nodeChildrenArray(node, skipDashed).map((child) => this.getTreeBoundingRectangle(child, skipDashed));
		return Rectangle.getBoundingRectangle(childRectangle.concat([node.collisionBox.getRectangle()]));
	}
	/**
	* 将一个子树 看成一个外接矩形，移动这个外接矩形左上角到某一个位置
	* @param treeRoot
	* @param targetLocation
	* @param skipDashed 是否跳过虚线边
	*/
	moveTreeRectTo(treeRoot, targetLocation, skipDashed = false) {
		const treeRect = this.getTreeBoundingRectangle(treeRoot, skipDashed);
		this.project.entityMoveManager.moveWithChildren(treeRoot, targetLocation.subtract(treeRect.leftTop), skipDashed);
	}
	/**
	* 获取根节点的所有第一层子节点，并根据指定方向进行排序
	* @param node 根节点
	* @param childNodes 子节点列表
	* @param direction 排序方向：col表示从上到下，row表示从左到右
	* @returns 排序后的子节点数组
	*/
	getSortedChildNodes(_node, childNodes, direction = "col") {
		if (direction === "col") return childNodes.sort((a, b) => a.collisionBox.getRectangle().top - b.collisionBox.getRectangle().top);
		else return childNodes.sort((a, b) => a.collisionBox.getRectangle().left - b.collisionBox.getRectangle().left);
	}
	/**
	* 排列多个子树，支持从上到下或从左到右排列
	* 从上到下排列多个子树，除了第一个子树，其他子树都相对于第一个子树的外接矩形进行位置调整
	* @param trees 要排列的子树数组
	* @param direction 要排列的是哪一侧的子树群
	* @param gap 子树之间的间距
	* @param skipDashed 是否跳过虚线边
	* @returns
	*/
	alignTrees(trees, direction, gap = 10, skipDashed = false) {
		if (trees.length === 0 || trees.length === 1) return;
		const firstTree = trees[0];
		const firstTreeRect = this.getTreeBoundingRectangle(firstTree, skipDashed);
		let currentPosition;
		if (direction === "right") {
			currentPosition = firstTreeRect.leftBottom.add(new Vector(0, gap));
			trees.sort((a, b) => a.collisionBox.getRectangle().top - b.collisionBox.getRectangle().top);
		} else if (direction === "left") {
			currentPosition = firstTreeRect.rightBottom.add(new Vector(0, gap));
			trees.sort((a, b) => a.collisionBox.getRectangle().top - b.collisionBox.getRectangle().top);
		} else if (direction === "bottom") {
			currentPosition = firstTreeRect.rightTop.add(new Vector(gap, 0));
			trees.sort((a, b) => a.collisionBox.getRectangle().left - b.collisionBox.getRectangle().left);
		} else {
			currentPosition = firstTreeRect.rightBottom.add(new Vector(gap, 0));
			trees.sort((a, b) => a.collisionBox.getRectangle().left - b.collisionBox.getRectangle().left);
		}
		let prevParentSection = trees[0].parentSection;
		for (let i = 1; i < trees.length; i++) {
			const tree = trees[i];
			const treeRect = this.getTreeBoundingRectangle(tree, skipDashed);
			const currParentSection = tree.parentSection;
			const sectionTopOverhead = 80;
			const sectionBottomOverhead = 30;
			let extraGap = 0;
			if (currParentSection !== prevParentSection) {
				if (currParentSection && currParentSection.text !== "") extraGap += sectionTopOverhead;
				if (prevParentSection && prevParentSection.text !== "") extraGap += sectionBottomOverhead;
			}
			if (direction === "right") {
				currentPosition.y += extraGap;
				this.moveTreeRectTo(tree, currentPosition, skipDashed);
				currentPosition.y += treeRect.height + gap;
			} else if (direction === "bottom") {
				currentPosition.x += extraGap;
				this.moveTreeRectTo(tree, currentPosition, skipDashed);
				currentPosition.x += treeRect.width + gap;
			} else if (direction === "left") {
				currentPosition.y += extraGap;
				this.moveTreeRectTo(tree, currentPosition.subtract(new Vector(treeRect.width, 0)), skipDashed);
				currentPosition.y += treeRect.height + gap;
			} else if (direction === "top") {
				currentPosition.x += extraGap;
				this.moveTreeRectTo(tree, currentPosition.subtract(new Vector(0, treeRect.height)), skipDashed);
				currentPosition.x += treeRect.width + gap;
			}
			prevParentSection = currParentSection;
		}
	}
	/**
	* 根据根节点位置，调整子树的位置
	* @param rootNode 固定位置的根节点
	* @param childList 需要调整位置的子节点列表
	* @param gap 根节点与子节点之间的间距
	* @param position 子节点相对于根节点的位置：rightCenter(右侧中心)、leftCenter(左侧中心)、bottomCenter(下方中心)、topCenter(上方中心)
	* @param skipDashed 是否跳过虚线边
	*/
	adjustChildrenTreesByRootNodeLocation(rootNode, childList, gap = 100, position = "rightCenter", skipDashed = false) {
		if (childList.length === 0) return;
		const parentRectangle = rootNode.collisionBox.getRectangle();
		const childsRectangle = Rectangle.getBoundingRectangle(childList.map((child) => child.collisionBox.getRectangle()));
		const sectionTopOverhead = 80;
		const firstChildSection = childList[0].parentSection;
		const sectionOffset = firstChildSection !== null && firstChildSection !== void 0 && firstChildSection.text !== "" && childList.every((c) => c.parentSection === firstChildSection) && firstChildSection !== rootNode.parentSection ? sectionTopOverhead : 0;
		let targetLocation;
		switch (position) {
			case "rightCenter":
				targetLocation = new Vector(parentRectangle.right + gap + childsRectangle.width / 2, parentRectangle.center.y + sectionOffset / 2);
				break;
			case "leftCenter":
				targetLocation = new Vector(parentRectangle.left - gap - childsRectangle.width / 2, parentRectangle.center.y + sectionOffset / 2);
				break;
			case "bottomCenter":
				targetLocation = new Vector(parentRectangle.center.x, parentRectangle.bottom + gap + sectionOffset + childsRectangle.height / 2);
				break;
			case "topCenter":
				targetLocation = new Vector(parentRectangle.center.x, parentRectangle.top - gap - childsRectangle.height / 2);
				break;
		}
		const offset = targetLocation.subtract(childsRectangle.center);
		for (const child of childList) this.project.entityMoveManager.moveWithChildren(child, offset, skipDashed);
	}
	/**
	* 检测并解决不同方向子树群之间的重叠问题
	* @param rootNode 根节点
	* @param directionGroups 不同方向的子树群
	* @param skipDashed 是否跳过虚线边
	* @param minGap 两个子树群之间的最小间距，推开时保证至少留出此间距
	*/
	resolveSubtreeOverlaps(rootNode, directionGroups, skipDashed = false, minGap = 0) {
		for (const { dir1, dir2 } of [
			{
				dir1: "right",
				dir2: "bottom"
			},
			{
				dir1: "right",
				dir2: "top"
			},
			{
				dir1: "right",
				dir2: "left"
			},
			{
				dir1: "bottom",
				dir2: "top"
			},
			{
				dir1: "bottom",
				dir2: "left"
			},
			{
				dir1: "top",
				dir2: "left"
			}
		]) {
			const group1 = directionGroups[dir1];
			const group2 = directionGroups[dir2];
			if (!group1 || !group2 || group1.length === 0 || group2.length === 0) continue;
			const rect1 = Rectangle.getBoundingRectangle(group1.map((child) => this.getTreeBoundingRectangle(child, skipDashed)));
			const rect2 = Rectangle.getBoundingRectangle(group2.map((child) => this.getTreeBoundingRectangle(child, skipDashed)));
			let pushCount = 0;
			while (this.hasOverlapOrLineIntersection(rootNode, group1, group2, dir1, dir2, skipDashed, minGap)) {
				pushCount++;
				if (pushCount > 1e3) break;
				const group1Size = group1.length;
				const group2Size = group2.length;
				let weakerDir;
				if (group1Size > group2Size) weakerDir = dir2;
				else if (group2Size > group1Size) weakerDir = dir1;
				else {
					const priorityOrder = [
						"right",
						"bottom",
						"left",
						"top"
					];
					weakerDir = priorityOrder.indexOf(dir1) < priorityOrder.indexOf(dir2) ? dir2 : dir1;
				}
				const weakerGroup = weakerDir === dir1 ? group1 : group2;
				const moveAmount = 10;
				let moveVector;
				switch (weakerDir) {
					case "right":
						moveVector = new Vector(moveAmount, 0);
						break;
					case "left":
						moveVector = new Vector(-10, 0);
						break;
					case "bottom":
						moveVector = new Vector(0, moveAmount);
						break;
					case "top":
						moveVector = new Vector(0, -10);
						break;
				}
				for (const child of weakerGroup) this.project.entityMoveManager.moveWithChildren(child, moveVector, skipDashed);
				if (weakerDir === dir1) {
					const newRect1 = Rectangle.getBoundingRectangle(group1.map((child) => this.getTreeBoundingRectangle(child, skipDashed)));
					rect1.location = newRect1.location.clone();
					rect1.size = newRect1.size.clone();
				} else {
					const newRect2 = Rectangle.getBoundingRectangle(group2.map((child) => this.getTreeBoundingRectangle(child, skipDashed)));
					rect2.location = newRect2.location.clone();
					rect2.size = newRect2.size.clone();
				}
			}
		}
	}
	/**
	* 检查两个方向子树群之间是否有矩形重叠或连线相交
	* @param rootNode 根节点
	* @param group1 第一个子树群
	* @param group2 第二个子树群
	* @param skipDashed 是否跳过虚线边
	* @param minGap 最小间距，矩形之间距离小于此值时也视为"重叠"需要推开
	*/
	hasOverlapOrLineIntersection(rootNode, group1, group2, dir1, dir2, skipDashed = false, minGap = 0) {
		const rect1 = Rectangle.getBoundingRectangle(group1.map((child) => this.getTreeBoundingRectangle(child, skipDashed)));
		const rect2 = Rectangle.getBoundingRectangle(group2.map((child) => this.getTreeBoundingRectangle(child, skipDashed)));
		if (Rectangle.fromEdges(rect1.left - minGap, rect1.top - minGap, rect1.right + minGap, rect1.bottom + minGap).isCollideWith(rect2)) return true;
		const rootRect = rootNode.collisionBox.getRectangle();
		if (dir1 === "right" && dir2 === "bottom" || dir1 === "bottom" && dir2 === "right") {
			const rightGroup = dir1 === "right" ? group1 : group2;
			const bottomGroup = dir1 === "bottom" ? group1 : group2;
			const rightRect = dir1 === "right" ? rect1 : rect2;
			const bottomRect = dir1 === "bottom" ? rect1 : rect2;
			const isRightGroupAbnormal = rightRect.left < rootRect.right;
			const isBottomGroupAbnormal = bottomRect.top < rootRect.bottom;
			if (isRightGroupAbnormal || isBottomGroupAbnormal) return false;
			if (rightGroup.length > 0 && bottomGroup.length > 0) {
				const rightNodeLeftCenter = rightGroup[rightGroup.length - 1].collisionBox.getRectangle().leftCenter.clone();
				if (new Line(rootRect.rightCenter.clone(), rightNodeLeftCenter).isCollideWithRectangle(bottomRect)) return true;
				const bottomNodeTopCenter = bottomGroup[bottomGroup.length - 1].collisionBox.getRectangle().topCenter.clone();
				if (new Line(rootRect.bottomCenter.clone(), bottomNodeTopCenter).isCollideWithRectangle(rightRect)) return true;
			}
		} else if (dir1 === "left" && dir2 === "bottom" || dir1 === "bottom" && dir2 === "left") {
			const leftGroup = dir1 === "left" ? group1 : group2;
			const bottomGroup = dir1 === "bottom" ? group1 : group2;
			const leftRect = dir1 === "left" ? rect1 : rect2;
			const bottomRect = dir1 === "bottom" ? rect1 : rect2;
			const isLeftGroupAbnormal = leftRect.right > rootRect.left;
			const isBottomGroupAbnormal = bottomRect.top < rootRect.bottom;
			if (isLeftGroupAbnormal || isBottomGroupAbnormal) return false;
			if (leftGroup.length > 0 && bottomGroup.length > 0) {
				const leftNodeRightCenter = leftGroup[leftGroup.length - 1].collisionBox.getRectangle().rightCenter.clone();
				if (new Line(rootRect.leftCenter.clone(), leftNodeRightCenter).isCollideWithRectangle(bottomRect)) return true;
				const bottomNodeTopCenter = bottomGroup[0].collisionBox.getRectangle().topCenter.clone();
				if (new Line(rootRect.bottomCenter.clone(), bottomNodeTopCenter).isCollideWithRectangle(leftRect)) return true;
			}
		} else if (dir1 === "left" && dir2 === "top" || dir1 === "top" && dir2 === "left") {
			const leftGroup = dir1 === "left" ? group1 : group2;
			const topGroup = dir1 === "top" ? group1 : group2;
			const leftRect = dir1 === "left" ? rect1 : rect2;
			const topRect = dir1 === "top" ? rect1 : rect2;
			const isLeftGroupAbnormal = leftRect.right > rootRect.left;
			const isTopGroupAbnormal = topRect.bottom > rootRect.top;
			if (isLeftGroupAbnormal || isTopGroupAbnormal) return false;
			if (leftGroup.length > 0 && topGroup.length > 0) {
				const leftNodeRightCenter = leftGroup[0].collisionBox.getRectangle().rightCenter.clone();
				if (new Line(rootRect.leftCenter.clone(), leftNodeRightCenter).isCollideWithRectangle(topRect)) return true;
				const topNodeBottomCenter = topGroup[0].collisionBox.getRectangle().bottomCenter.clone();
				if (new Line(rootRect.topCenter.clone(), topNodeBottomCenter).isCollideWithRectangle(leftRect)) return true;
			}
		} else if (dir1 === "right" && dir2 === "top" || dir1 === "top" && dir2 === "right") {
			const rightGroup = dir1 === "right" ? group1 : group2;
			const topGroup = dir1 === "top" ? group1 : group2;
			const rightRect = dir1 === "right" ? rect1 : rect2;
			const topRect = dir1 === "top" ? rect1 : rect2;
			const isRightGroupAbnormal = rightRect.left < rootRect.right;
			const isTopGroupAbnormal = topRect.bottom > rootRect.top;
			if (isRightGroupAbnormal || isTopGroupAbnormal) return false;
			if (rightGroup.length > 0 && topGroup.length > 0) {
				const rightNodeLeftCenter = rightGroup[0].collisionBox.getRectangle().leftCenter.clone();
				if (new Line(rootRect.rightCenter.clone(), rightNodeLeftCenter).isCollideWithRectangle(topRect)) return true;
				const topNodeBottomCenter = topGroup[topGroup.length - 1].collisionBox.getRectangle().bottomCenter.clone();
				if (new Line(rootRect.topCenter.clone(), topNodeBottomCenter).isCollideWithRectangle(rightRect)) return true;
			}
		}
		return false;
	}
	/**
	* 获取一组连线中文字外接矩形的最大尺寸
	* @param edges 连线列表
	* @param direction "horizontal" 取宽度，"vertical" 取高度
	*/
	getMaxEdgeTextDimension(edges, direction) {
		let maxDim = 0;
		for (const edge of edges) {
			if (edge.text.trim() === "") continue;
			const rect = edge.textRectangle;
			const dim = direction === "horizontal" ? rect.width : rect.height;
			if (dim > maxDim) maxDim = dim;
		}
		return maxDim;
	}
	/**
	* 快速树形布局
	* @param rootNode
	*/
	autoLayoutFastTreeMode(rootNode) {
		const rootLeftTopLocation = rootNode.collisionBox.getRectangle().leftTop.clone();
		const dfs = (node) => {
			const outEdges = this.project.graphMethods.getOutgoingEdges(node).filter((edge) => !("lineType" in edge && edge.lineType === "dashed"));
			const outRightEdges = outEdges.filter((edge) => edge.isLeftToRight());
			const outLeftEdges = outEdges.filter((edge) => edge.isRightToLeft());
			const outTopEdges = outEdges.filter((edge) => edge.isBottomToTop());
			const outBottomEdges = outEdges.filter((edge) => edge.isTopToBottom());
			const outUnknownEdges = outEdges.filter((edge) => edge.isUnknownDirection());
			const outNonStandardEdges = outEdges.filter((edge) => edge.isNonStandardDirection());
			let rightChildList = outRightEdges.map((edge) => edge.target);
			let leftChildList = outLeftEdges.map((edge) => edge.target);
			let topChildList = outTopEdges.map((edge) => edge.target);
			let bottomChildList = outBottomEdges.map((edge) => edge.target);
			const unknownChildList = outUnknownEdges.map((edge) => edge.target);
			const nonStandardChildList = outNonStandardEdges.map((edge) => edge.target);
			rightChildList = this.getSortedChildNodes(node, rightChildList, "col");
			leftChildList = this.getSortedChildNodes(node, leftChildList, "col");
			topChildList = this.getSortedChildNodes(node, topChildList, "row");
			bottomChildList = this.getSortedChildNodes(node, bottomChildList, "row");
			for (const child of rightChildList) dfs(child);
			for (const child of topChildList) dfs(child);
			for (const child of bottomChildList) dfs(child);
			for (const child of leftChildList) dfs(child);
			for (const child of unknownChildList) dfs(child);
			for (const child of nonStandardChildList) dfs(child);
			let treesGap = 20;
			let fatherChildNearGap = 50;
			if (node instanceof TextNode) {
				treesGap = treesGap * 2 ** (node.fontScaleLevel / 2);
				fatherChildNearGap = fatherChildNearGap * 2 ** (node.fontScaleLevel / 2);
			}
			const fatherChildNormalGap = fatherChildNearGap * 3;
			const rightEdgeTextWidth = this.getMaxEdgeTextDimension(outRightEdges, "horizontal");
			const leftEdgeTextWidth = this.getMaxEdgeTextDimension(outLeftEdges, "horizontal");
			const topEdgeTextHeight = this.getMaxEdgeTextDimension(outTopEdges, "vertical");
			const bottomEdgeTextHeight = this.getMaxEdgeTextDimension(outBottomEdges, "vertical");
			this.alignTrees(rightChildList, "right", treesGap, true);
			this.adjustChildrenTreesByRootNodeLocation(node, rightChildList, fatherChildNormalGap + rightEdgeTextWidth, "rightCenter", true);
			this.alignTrees(topChildList, "top", treesGap, true);
			const topGap = (topChildList.length === 1 ? fatherChildNearGap : fatherChildNormalGap) + topEdgeTextHeight;
			this.adjustChildrenTreesByRootNodeLocation(node, topChildList, topGap, "topCenter", true);
			this.alignTrees(bottomChildList, "bottom", treesGap, true);
			const bottomGap = (bottomChildList.length === 1 ? fatherChildNearGap : fatherChildNormalGap) + bottomEdgeTextHeight;
			this.adjustChildrenTreesByRootNodeLocation(node, bottomChildList, bottomGap, "bottomCenter", true);
			this.alignTrees(leftChildList, "left", treesGap, true);
			this.adjustChildrenTreesByRootNodeLocation(node, leftChildList, fatherChildNormalGap + leftEdgeTextWidth, "leftCenter", true);
			this.resolveSubtreeOverlaps(node, {
				right: rightChildList.length > 0 ? rightChildList : void 0,
				left: leftChildList.length > 0 ? leftChildList : void 0,
				bottom: bottomChildList.length > 0 ? bottomChildList : void 0,
				top: topChildList.length > 0 ? topChildList : void 0
			}, true, treesGap);
		};
		dfs(rootNode);
		const delta = rootLeftTopLocation.subtract(rootNode.collisionBox.getRectangle().leftTop);
		const treeNodes = this.project.graphMethods.getSuccessorSet(rootNode, true, true);
		for (const node of treeNodes) this.project.entityMoveManager.moveEntityUtils(node, delta);
	}
	treeReverseX(selectedRootEntity) {
		this.treeReverse(selectedRootEntity, "X");
	}
	treeReverseY(selectedRootEntity) {
		this.treeReverse(selectedRootEntity, "Y");
	}
	/**
	* 将树形结构翻转位置
	* @param selectedRootEntity
	*/
	treeReverse(selectedRootEntity, direction) {
		if (this.project.graphMethods.nodeChildrenArray(selectedRootEntity).length <= 1) return;
		const dfs = (node) => {
			const childList = this.project.graphMethods.nodeChildrenArray(node);
			for (const child of childList) dfs(child);
			const currentNodeCenter = node.collisionBox.getRectangle().center;
			const rootNodeCenter = selectedRootEntity.collisionBox.getRectangle().center;
			if (direction === "X") node.move(new Vector(-((currentNodeCenter.x - rootNodeCenter.x) * 2), 0));
			else if (direction === "Y") node.move(new Vector(0, -((currentNodeCenter.y - rootNodeCenter.y) * 2)));
		};
		dfs(selectedRootEntity);
	}
};
AutoLayoutFastTree = __decorate([service("autoLayoutFastTree"), __decorateMetadata("design:paramtypes", [typeof Project === "undefined" ? Object : Project])], AutoLayoutFastTree);
//#endregion
export { AutoLayoutFastTree as t };
