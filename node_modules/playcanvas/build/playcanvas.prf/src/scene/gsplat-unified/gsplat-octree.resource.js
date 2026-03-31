import { Vec3 } from '../../core/math/vec3.js';
import { BoundingBox } from '../../core/shape/bounding-box.js';
import { GSplatOctree } from './gsplat-octree.js';

class GSplatOctreeResource {
		constructor(assetFileUrl, data, assetLoader){
				this.aabb = new BoundingBox();
				this.octree = new GSplatOctree(assetFileUrl, data);
				this.octree.assetLoader = assetLoader;
				this.aabb.setMinMax(new Vec3(data.tree.bound.min), new Vec3(data.tree.bound.max));
		}
		destroy() {
				this.octree?.destroy();
				this.octree = null;
		}
}

export { GSplatOctreeResource };
