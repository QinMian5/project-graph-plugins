//#region src/cli/ClosedProjectSoundService.ts
var noOp = () => void 0;
var SoundService = {
	getPitchVariationRange: () => 0,
	play: {
		cuttingLineStart: noOp,
		connectLineStart: noOp,
		connectFindTarget: noOp,
		cuttingLineRelease: noOp,
		alignAndAttach: noOp,
		mouseEnterButton: noOp,
		mouseClickButton: noOp,
		mouseClickSwitchButtonOn: noOp,
		mouseClickSwitchButtonOff: noOp,
		packEntityToSectionSoundFile: noOp,
		treeGenerateDeepSoundFile: noOp,
		treeGenerateBroadSoundFile: noOp,
		treeAdjustSoundFile: noOp,
		viewAdjustSoundFile: noOp,
		entityJumpSoundFile: noOp,
		associationAdjustSoundFile: noOp
	},
	playSoundByFilePath: noOp
};
//#endregion
export { SoundService as t };
