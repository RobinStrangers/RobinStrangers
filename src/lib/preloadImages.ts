import { CHARACTERS } from '../config/characters'
import { preloadCharacterRig, preloadImage } from './createWalkFrames'

export async function preloadStrangerAssets(): Promise<void> {
  const unique = [...new Set(CHARACTERS.map((character) => character.src))]
  await Promise.all(unique.map((src) => preloadImage(src)))
  await Promise.all(unique.map((src) => preloadCharacterRig(src)))
}
