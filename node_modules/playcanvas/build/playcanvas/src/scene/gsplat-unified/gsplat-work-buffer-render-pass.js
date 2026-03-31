import { Mat4 } from '../../core/math/mat4.js';
import { RenderPass } from '../../platform/graphics/render-pass.js';
import { BlendState } from '../../platform/graphics/blend-state.js';
import { DepthState } from '../../platform/graphics/depth-state.js';
import { CULLFACE_NONE } from '../../platform/graphics/constants.js';

const _viewMat = new Mat4();
const _whiteColor = [
		1,
		1,
		1
];
class GSplatWorkBufferRenderPass extends RenderPass {
		constructor(device, workBuffer, colorOnly = false){
				super(device), this.splats = [], this.colorsByLod = undefined, this.cameraNode = null;
				this.workBuffer = workBuffer;
				this.colorOnly = colorOnly;
		}
		init(renderTarget) {
				super.init(renderTarget);
				this.colorOps.clear = false;
				this.depthStencilOps.clearDepth = false;
		}
		update(splats, cameraNode, colorsByLod) {
				this.splats.length = 0;
				this.colorsByLod = colorsByLod;
				for(let i = 0; i < splats.length; i++){
						const splatInfo = splats[i];
						if (splatInfo.activeSplats > 0) {
								this.splats.push(splatInfo);
						}
				}
				this.cameraNode = cameraNode;
				return this.splats.length > 0;
		}
		execute() {
				const { device, splats, cameraNode } = this;
				device.setBlendState(BlendState.NOBLEND);
				device.setCullMode(CULLFACE_NONE);
				device.setDepthState(DepthState.NODEPTH);
				device.setStencilState();
				const viewInvMat = cameraNode.getWorldTransform();
				const viewMat = _viewMat.copy(viewInvMat).invert();
				device.scope.resolve('matrix_view').setValue(viewMat.data);
				for(let i = 0; i < splats.length; i++){
						this.renderSplat(splats[i]);
				}
		}
		renderSplat(splatInfo) {
				const { device, resource } = splatInfo;
				const scope = device.scope;
				const { intervals, activeSplats, lineStart, viewport, intervalTexture } = splatInfo;
				const workBufferRenderInfo = resource.getWorkBufferRenderInfo(intervals.length > 0, this.workBuffer.colorTextureFormat, this.colorOnly);
				workBufferRenderInfo.material.setParameters(device);
				if (intervalTexture) {
						scope.resolve('uIntervalsTexture').setValue(intervalTexture.texture);
				}
				scope.resolve('uActiveSplats').setValue(activeSplats);
				scope.resolve('uStartLine').setValue(lineStart);
				scope.resolve('uViewportWidth').setValue(viewport.z);
				const color = this.colorsByLod?.[splatInfo.lodIndex] ?? this.colorsByLod?.[0] ?? _whiteColor;
				scope.resolve('uColorMultiply').setValue(color);
				scope.resolve('matrix_model').setValue(splatInfo.node.getWorldTransform().data);
				workBufferRenderInfo.quadRender.render(viewport);
		}
		destroy() {
				this.splats.length = 0;
				super.destroy();
		}
}

export { GSplatWorkBufferRenderPass };
