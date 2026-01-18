
import { ActivityItem } from '../../services/activity.service';

export function sortActivitiesByRecency(items: ActivityItem[]): ActivityItem[] {
    return items.sort((a, b) => b.timestamp - a.timestamp);
}

export function createActivityItem(
    type: 'chat' | 'novel' | 'web_novel', 
    id: string, 
    title: string, 
    image: string, 
    subtitle: string
): ActivityItem {
    return {
        type,
        id,
        title,
        image,
        subtitle,
        timestamp: Date.now()
    };
}
