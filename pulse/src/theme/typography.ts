/** Typography scale following PRD design principles */
export const TYPOGRAPHY = {
  hero: { fontSize: 32, lineHeight: 38, fontWeight: '700' as const },
  heading: { fontSize: 20, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' as const },
  caption: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  small: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
} as const;
