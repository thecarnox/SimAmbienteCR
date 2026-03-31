import { Vec2 } from '../../core/math/vec2.js';
import { BoundingBox } from '../../core/shape/bounding-box.js';
import { TYPE_UINT32, SEMANTIC_ATTR13, BUFFER_STATIC, ADDRESS_CLAMP_TO_EDGE, FILTER_NEAREST } from '../../platform/graphics/constants.js';
import { Texture } from '../../platform/graphics/texture.js';
import { VertexFormat } from '../../platform/graphics/vertex-format.js';
import { VertexBuffer } from '../../platform/graphics/vertex-buffer.js';
import { Mesh } from '../mesh.js';
import { ShaderMaterial } from '../materials/shader-material.js';
import { WorkBufferRenderInfo } from '../gsplat-unified/gsplat-work-buffer.js';

let id = 0;
const tempMap = new Map();
class GSplatResourceBase {
		constructor(device, gsplatData){
				this.id = id++;
				this.workBufferRenderInfos = new Map();
				this._refCount = 0;
				this.device = device;
				this.gsplatData = gsplatData;
				this.centers = gsplatData.getCenters();
				this.aabb = new BoundingBox();
				gsplatData.calcAabb(this.aabb);
				this.mesh = GSplatResourceBase.createMesh(device);
				this.instanceIndices = GSplatResourceBase.createInstanceIndices(device, gsplatData.numSplats);
				this.mesh.incRefCount();
				this.mesh.aabb.copy(this.aabb);
		}
		destroy() {
				this.mesh?.destroy();
				this.instanceIndices?.destroy();
				this.workBufferRenderInfos.forEach((info)=>info.destroy());
				this.workBufferRenderInfos.clear();
		}
		incRefCount() {
				this._refCount++;
		}
		decRefCount() {
				this._refCount--;
		}
		get refCount() {
				return this._refCount;
		}
		getWorkBufferRenderInfo(useIntervals, colorTextureFormat, colorOnly = false) {
				this.configureMaterialDefines(tempMap);
				if (useIntervals) tempMap.set('GSPLAT_LOD', '');
				if (colorOnly) tempMap.set('GSPLAT_COLOR_ONLY', '');
				const key = Array.from(tempMap.entries()).map(([k, v])=>`${k}=${v}`).join(';');
				let info = this.workBufferRenderInfos.get(key);
				if (!info) {
						const material = new ShaderMaterial();
						this.configureMaterial(material);
						tempMap.forEach((v, k)=>material.setDefine(k, v));
						info = new WorkBufferRenderInfo(this.device, key, material, colorTextureFormat, colorOnly);
						this.workBufferRenderInfos.set(key, info);
				}
				tempMap.clear();
				return info;
		}
		static createMesh(device) {
				const splatInstanceSize = GSplatResourceBase.instanceSize;
				const meshPositions = new Float32Array(12 * splatInstanceSize);
				const meshIndices = new Uint32Array(6 * splatInstanceSize);
				for(let i = 0; i < splatInstanceSize; ++i){
						meshPositions.set([
								-1,
								-1,
								i,
								1,
								-1,
								i,
								1,
								1,
								i,
								-1,
								1,
								i
						], i * 12);
						const b = i * 4;
						meshIndices.set([
								0 + b,
								1 + b,
								2 + b,
								0 + b,
								2 + b,
								3 + b
						], i * 6);
				}
				const mesh = new Mesh(device);
				mesh.setPositions(meshPositions, 3);
				mesh.setIndices(meshIndices);
				mesh.update();
				return mesh;
		}
		static createInstanceIndices(device, splatCount) {
				const splatInstanceSize = GSplatResourceBase.instanceSize;
				const numSplats = Math.ceil(splatCount / splatInstanceSize) * splatInstanceSize;
				const numSplatInstances = numSplats / splatInstanceSize;
				const indexData = new Uint32Array(numSplatInstances);
				for(let i = 0; i < numSplatInstances; ++i){
						indexData[i] = i * splatInstanceSize;
				}
				const vertexFormat = new VertexFormat(device, [
						{
								semantic: SEMANTIC_ATTR13,
								components: 1,
								type: TYPE_UINT32,
								asInt: true
						}
				]);
				const instanceIndices = new VertexBuffer(device, vertexFormat, numSplatInstances, {
						usage: BUFFER_STATIC,
						data: indexData.buffer
				});
				return instanceIndices;
		}
		static get instanceSize() {
				return 128;
		}
		get numSplats() {
				return this.gsplatData.numSplats;
		}
		configureMaterial(material) {}
		configureMaterialDefines(defines) {}
		evalTextureSize(count) {
				return Vec2.ZERO;
		}
		createTexture(name, format, size, data) {
				return new Texture(this.device, {
						name: name,
						width: size.x,
						height: size.y,
						format: format,
						cubemap: false,
						mipmaps: false,
						minFilter: FILTER_NEAREST,
						magFilter: FILTER_NEAREST,
						addressU: ADDRESS_CLAMP_TO_EDGE,
						addressV: ADDRESS_CLAMP_TO_EDGE,
						...data ? {
								levels: [
										data
								]
						} : {}
				});
		}
		instantiate() {}
}

export { GSplatResourceBase };
