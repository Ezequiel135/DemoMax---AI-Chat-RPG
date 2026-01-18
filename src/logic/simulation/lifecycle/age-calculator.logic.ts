
export class AgeCalculatorLogic {
  static calculateAge(birthTimestamp: number): number {
    const now = Date.now();
    const diff = now - birthTimestamp;
    const ageDate = new Date(diff); 
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  static isBirthday(characterId: string): boolean {
    const today = new Date();
    const seed = characterId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const targetMonth = seed % 12;
    const targetDay = (seed % 28) + 1;
    return today.getMonth() === targetMonth && today.getDate() === targetDay;
  }
}
