export const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    const timeString = date.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).toLowerCase();

    if (diffDays === 0) {
        return `Today, ${timeString}`;
    } else if (diffDays === 1) {
        return `Yesterday, ${timeString}`;
    } else if (diffDays < 7) {
        return `${diffDays} days ago, ${timeString}`;
    } else if (diffWeeks < 4) {
        return `${diffWeeks} weeks ago, ${timeString}`;
    } else if (diffMonths < 12) {
        return `${diffMonths} months ago, ${timeString}`;
    } else {
        const diffYears = Math.floor(diffDays / 365);
        return `${diffYears} years ago, ${timeString}`;
    }
}

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
