var packHalfPS = `
#if defined(PLATFORM_ANDROID)
	fn floatToHalf(a: f32) -> u32 {
		let u: u32	= bitcast<u32>(a);
		let sign: u32 = (u >> 16u) & 0x8000u;
		let absu: u32 = u & 0x7FFFFFFFu;
		let man: u32  = u & 0x007FFFFFu;
		let e32: i32  = i32((u >> 23u) & 0xFFu) - 127;
		
		if ((absu & 0x7F800000u) == 0x7F800000u) {
			let isnan = (man != 0u);
			return sign | select(0x7C00u, 0x7E00u, isnan);
		}
		
		if (e32 > 15) { return sign | 0x7C00u; }
		
		if (e32 >= -14) {
			var he: u32 = u32(e32 + 15);
			var hm: u32 = man >> 13u;
			let rem: u32 = man & 0x1FFFu;
			let add: u32 = select(0u, 1u, (rem > 0x1000u) || (rem == 0x1000u && (hm & 1u) == 1u));
			hm = (hm + add) & 0x3FFu;
			if ((hm & 0x400u) != 0u) {
				hm = 0u; he = he + 1u;
				if (he >= 31u) { return sign | 0x7C00u; }
			}
			return sign | (he << 10u) | hm;
		}
		
		if (e32 >= -24) {
			let s: u32	  = u32(-(e32 + 1));
			let mnorm: u32  = 0x00800000u | man;
			var hm: u32	 = mnorm >> s;
			let mask: u32   = (1u << s) - 1u;
			let rem: u32	= mnorm & mask;
			let halfBt: u32 = 1u << (s - 1u);
			let add: u32	= select(0u, 1u, (rem > halfBt) || (rem == halfBt && (hm & 1u) == 1u));
			hm = hm + add;
			if (hm >= 0x400u) { return sign | (1u << 10u); }
			return sign | hm;
		}
		
		return sign;
	}
	fn pack2x16floatSafe(v: vec2f) -> u32 {
		let u_x: u32  = bitcast<u32>(v.x);
		let u_y: u32  = bitcast<u32>(v.y);
		
		let e32_x: i32 = i32((u_x >> 23u) & 0xFFu) - 127;
		let e32_y: i32 = i32((u_y >> 23u) & 0xFFu) - 127;
		
		if (e32_x < -14 || e32_y < -14) {
			return (floatToHalf(v.y) << 16u) | floatToHalf(v.x);
		}
		
		return pack2x16float(v);
	}
#else
	fn pack2x16floatSafe(v: vec2f) -> u32 {
		return pack2x16float(v);
	}
#endif
`;

export { packHalfPS as default };
