var gsplatHelpersVS = `
float gsplatExtractSize(vec3 covA, vec3 covB) {
	float tr = covA.x + covB.x + covB.z;
	return sqrt(max(tr, 0.0) / 3.0);
}
void gsplatApplyUniformScale(inout vec3 covA, inout vec3 covB, float scale) {
	float s2 = scale * scale;
	covA *= s2;
	covB *= s2;
}
void gsplatMakeRound(inout vec3 covA, inout vec3 covB, float size) {
	float s2 = size * size;
	covA = vec3(s2, 0.0, 0.0);
	covB = vec3(s2, 0.0, s2);
}
`;

export { gsplatHelpersVS as default };
