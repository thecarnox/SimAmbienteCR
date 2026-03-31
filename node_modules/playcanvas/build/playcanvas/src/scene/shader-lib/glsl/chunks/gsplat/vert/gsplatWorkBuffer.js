var gsplatWorkBufferVS = `
uniform highp usampler2D splatTexture0;
uniform highp usampler2D splatTexture1;
#ifdef GSPLAT_COLOR_UINT
	uniform highp usampler2D splatColor;
#else
	uniform mediump sampler2D splatColor;
#endif
uvec4 cachedSplatTexture0Data;
uvec2 cachedSplatTexture1Data;
void loadSplatTextures(SplatSource source) {
	cachedSplatTexture0Data = texelFetch(splatTexture0, source.uv, 0);
	cachedSplatTexture1Data = texelFetch(splatTexture1, source.uv, 0).xy;
}
vec3 readCenter(SplatSource source) {
	return vec3(uintBitsToFloat(cachedSplatTexture0Data.r), uintBitsToFloat(cachedSplatTexture0Data.g), uintBitsToFloat(cachedSplatTexture0Data.b));
}
void readCovariance(in SplatSource source, out vec3 cov_A, out vec3 cov_B) {
	vec2 covAxy = unpackHalf2x16(cachedSplatTexture1Data.x);
	vec2 covBxy = unpackHalf2x16(cachedSplatTexture1Data.y);
	vec2 covAzBz = unpackHalf2x16(cachedSplatTexture0Data.a);
	cov_A = vec3(covAxy, covAzBz.x);
	cov_B = vec3(covBxy, covAzBz.y);
}
vec4 readColor(in SplatSource source) {
	#ifdef GSPLAT_COLOR_UINT
		uvec4 packed = texelFetch(splatColor, source.uv, 0);
		uint packed_rg = packed.r | (packed.g << 16u);
		uint packed_ba = packed.b | (packed.a << 16u);
		return vec4(unpackHalf2x16(packed_rg), unpackHalf2x16(packed_ba));
	#else
		return texelFetch(splatColor, source.uv, 0);
	#endif
}
`;

export { gsplatWorkBufferVS as default };
