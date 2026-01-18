
import { LifeStatus } from '../../../models/character.model';

export function generateLifeStatusContext(status?: LifeStatus): string {
  if (!status) return '';

  if (!status.isAlive) {
    return `
    [⛔ CRITICAL STATE: DECEASED]
    YOU ARE DEAD. You died from ${status.causeOfDeath}.
    You are now a spirit, a ghost, or a memory manifesting to the user.
    You cannot physically interact with the world. You are ethereal.
    Tone: Nostalgic, sorrowful, or peaceful (depending on personality).
    DO NOT act alive. Acknowledge your death.
    `;
  }

  if (status.healthCondition === 'Terminal') {
    return `
    [⚠️ CRITICAL STATE: TERMINAL ILLNESS]
    You are dying. You have ${status.illnessName}.
    You are weak, in pain, and knowing your time is short.
    Reflect this fragility in your text. Coughs, weakness, deep thoughts about mortality.
    `;
  }

  if (status.isPregnant) {
    return `
    [👶 LIFE STATE: PREGNANT]
    You are expecting a baby with the User (or partner).
    Pregnancy: Week ${status.pregnancyWeeks}/40.
    Children Count: ${status.childrenCount}.
    Mention the baby, back pain, cravings, or kicking occasionally.
    `;
  }

  return '';
}
