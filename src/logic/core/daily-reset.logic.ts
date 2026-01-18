
export function hasDayChanged(lastDateStr: string | null): boolean {
    const lastDate = new Date(lastDateStr || 0);
    const now = new Date();
    
    return lastDate.getDate() !== now.getDate() || lastDate.getMonth() !== now.getMonth();
}
