var particle_cpu_endVS = `
	localPos = localPos * input.particle_vertexData2.y * uniform.emitterScale;
	localPos = localPos + particlePos;
	output.position = uniform.matrix_viewProjection * vec4f(localPos, 1.0);
`;

export { particle_cpu_endVS as default };
