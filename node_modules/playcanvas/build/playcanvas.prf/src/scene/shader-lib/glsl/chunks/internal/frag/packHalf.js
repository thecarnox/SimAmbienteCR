var packHalfPS = `
#if defined(PLATFORM_ANDROID)
	uint floatToHalf(float a) {
		uint u	= floatBitsToUint(a);
		uint sign = (u >> 16u) & 0x8000u;
		uint absu = u & 0x7FFFFFFFu;
		uint man  = u & 0x007FFFFFu;
		int  e32  = int((u >> 23u) & 0xFFu) - 127;
		
		if ((absu & 0x7F800000u) == 0x7F800000u) {
			bool isnan = (man != 0u);
			return sign | (isnan ? 0x7E00u : 0x7C00u);
		}
		
		if (e32 > 15) return sign | 0x7C00u;
		
		if (e32 >= -14) {
			uint he  = uint(e32 + 15);
			uint hm  = man >> 13u;
			uint rem = man & 0x1FFFu;
			uint add = (rem > 0x1000u || (rem == 0x1000u && (hm & 1u) == 1u)) ? 1u : 0u;
			hm = (hm + add) & 0x3FFu;
			if ((hm & 0x400u) != 0u) {
				hm = 0u; he = he + 1u;
				if (he >= 31u) return sign | 0x7C00u;
			}
			return sign | (he << 10u) | hm;
		}
		
		if (e32 >= -24) {
			uint s	  = uint(-(e32 + 1));
			uint mnorm  = 0x00800000u | man;
			uint hm	 = mnorm >> s;
			uint mask   = (1u << s) - 1u;
			uint rem	= mnorm & mask;
			uint halfBt = 1u << (s - 1u);
			uint add	= (rem > halfBt || (rem == halfBt && (hm & 1u) == 1u)) ? 1u : 0u;
			hm = hm + add;
			if (hm >= 0x400u) return sign | (1u << 10u);
			return sign | hm;
		}
		
		return sign;
	}
	uint packHalf2x16Safe(vec2 v) {
		uint u_x  = floatBitsToUint(v.x);
		uint u_y  = floatBitsToUint(v.y);
		
		int  e32_x = int((u_x >> 23u) & 0xFFu) - 127;
		int  e32_y = int((u_y >> 23u) & 0xFFu) - 127;
		
		if (e32_x < -14 || e32_y < -14) {
			return (floatToHalf(v.y) << 16u) | floatToHalf(v.x);
		}
		
		return packHalf2x16(v);
	}
#else
	uint packHalf2x16Safe(vec2 v) {
		return packHalf2x16(v);
	}
#endif
`;

export { packHalfPS as default };
