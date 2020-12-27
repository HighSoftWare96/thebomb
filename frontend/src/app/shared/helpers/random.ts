export function generateAvatarSeed() {
  return Math.random().toString(36).substring(2, 8);
}