export function calculateDistance(coord1, coord2) {
    const R = 6371e3; // Earth's radius in meters
    const lat1 = coord1.latitude * Math.PI / 180;
    const lat2 = coord2.latitude * Math.PI / 180;
    const deltaLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const deltaLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
export function isWithinRadius(coord1, coord2, radius) {
    const distance = calculateDistance(coord1, coord2);
    return distance <= radius;
}
/**
 * calculates the direction from coord1 to coord2
 * @param coord1
 * @param coord2
 * @returns
 */
export function direction(coord1, coord2) {
    const deltaLat = coord2.latitude - coord1.latitude;
    const deltaLon = coord2.longitude - coord1.longitude;
    if (deltaLat > 0 && deltaLon > 0)
        return "Northeast";
    if (deltaLat > 0 && deltaLon < 0)
        return "Northwest";
    if (deltaLat < 0 && deltaLon > 0)
        return "Southeast";
    if (deltaLat < 0 && deltaLon < 0)
        return "Southwest";
    if (deltaLat > 0)
        return "North";
    if (deltaLat < 0)
        return "South";
    if (deltaLon > 0)
        return "East";
    if (deltaLon < 0)
        return "West";
    return "Same location";
}
