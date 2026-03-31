var wgslGsplatCopyToWorkBufferPS = `
#define GSPLAT_CENTER_NOPROJ
#include "gsplatStructsVS"
#include "gsplatCenterVS"
#include "gsplatEvalSHVS"
#include "gsplatQuatToMat3VS"
#include "gsplatSourceFormatVS"
#include "packHalfPS"
uniform uStartLine: i32;
uniform uViewportWidth: i32;
#ifdef GSPLAT_LOD
	var uIntervalsTexture: texture_2d<u32>;
#endif
uniform uColorMultiply: vec3f;
uniform uActiveSplats: i32;
@fragment
fn fragmentMain(input: FragmentInput) -> FragmentOutput {
	var output: FragmentOutput;
	
	let localFragCoords = vec2i(i32(input.position.x), i32(input.position.y) - uniform.uStartLine);
	let targetIndex = localFragCoords.y * uniform.uViewportWidth + localFragCoords.x;
	
	if (targetIndex >= uniform.uActiveSplats) {
		output.color = vec4f(0.0);
		#ifndef GSPLAT_COLOR_ONLY
			output.color1 = vec4u(0u);
			output.color2 = vec2u(0u);
		#endif
	} else {
		#ifdef GSPLAT_LOD
			let intervalsSize = i32(textureDimensions(uIntervalsTexture, 0).x);
			let intervalUV = vec2i(targetIndex % intervalsSize, targetIndex / intervalsSize);
			let originalIndex = textureLoad(uIntervalsTexture, intervalUV, 0).r;
		#else
			let originalIndex = targetIndex;
		#endif
		
		var srcSize: u32;
		#if defined(GSPLAT_SOGS_DATA) || defined(GSPLAT_COMPRESSED_DATA)
			srcSize = u32(textureDimensions(packedTexture, 0).x);
		#else
			srcSize = u32(textureDimensions(splatColor, 0).x);
		#endif
		
		var source: SplatSource;
		source.id = u32(originalIndex);
		source.uv = vec2i(i32(source.id % srcSize), i32(source.id / srcSize));
		var modelCenter = readCenter(&source);
		let worldCenter = (uniform.matrix_model * vec4f(modelCenter, 1.0)).xyz;
		var center: SplatCenter;
		initCenter(modelCenter, &center);
		var covA: vec3f;
		var covB: vec3f;
		readCovariance(&source, &covA, &covB);
		let C = mat3x3f(
			vec3f(covA.x, covA.y, covA.z),
			vec3f(covA.y, covB.x, covB.y),
			vec3f(covA.z, covB.y, covB.z)
		);
		let linear = mat3x3f(uniform.matrix_model[0].xyz, uniform.matrix_model[1].xyz, uniform.matrix_model[2].xyz);
		let Ct = linear * C * transpose(linear);
		covA = Ct[0];
		covB = vec3f(Ct[1][1], Ct[1][2], Ct[2][2]);
		var color = readColor(&source);
		#if SH_BANDS > 0
			let dir = normalize(center.view * mat3x3f(center.modelView[0].xyz, center.modelView[1].xyz, center.modelView[2].xyz));
			var sh: array<vec3f, SH_COEFFS>;
			var scale: f32;
			readSHData(&source, &sh, &scale);
			color = vec4f(color.xyz + evalSH(&sh, dir) * scale, color.w);
		#endif
		color = vec4f(color.xyz * uniform.uColorMultiply, color.w);
		output.color = color;
		#ifndef GSPLAT_COLOR_ONLY
			output.color1 = vec4u(bitcast<u32>(worldCenter.x), bitcast<u32>(worldCenter.y), bitcast<u32>(worldCenter.z), pack2x16floatSafe(vec2f(covA.z, covB.z)));
			output.color2 = vec2u(pack2x16floatSafe(covA.xy), pack2x16floatSafe(covB.xy));
		#endif
	}
	
	return output;
}
`;

export { wgslGsplatCopyToWorkBufferPS as default };
