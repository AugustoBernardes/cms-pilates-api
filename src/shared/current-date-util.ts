export function currentDateStringUtil(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const monthDate = `${year}-${month}`;

    return monthDate
}