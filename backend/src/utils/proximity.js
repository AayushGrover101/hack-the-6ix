/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Object} coord1 - First coordinate {latitude: number, longitude: number}
 * @param {Object} coord2 - Second coordinate {latitude: number, longitude: number}
 * @returns {number} Distance in meters
 */
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

/**
 * Check if two coordinates are within a specified radius
 * @param {Object} coord1 - First coordinate {latitude: number, longitude: number}
 * @param {Object} coord2 - Second coordinate {latitude: number, longitude: number}
 * @param {number} radius - Radius in meters
 * @returns {boolean} True if coordinates are within radius
 */
export function isWithinRadius(coord1, coord2, radius) {
  const distance = calculateDistance(coord1, coord2);
  return distance <= radius;
}

/**
 * Calculate the compass bearing from coord1 to coord2
 * @param {Object} coord1 - Starting coordinate {latitude: number, longitude: number}
 * @param {Object} coord2 - Target coordinate {latitude: number, longitude: number}
 * @returns {number} Compass bearing in degrees (0-360, where 0° is North)
 */
export function direction(coord1, coord2) {
  const deltaLat = coord2.latitude - coord1.latitude;
  const deltaLon = coord2.longitude - coord1.longitude;

  // If coordinates are the same, return 0 (North)
  if (deltaLat === 0 && deltaLon === 0) {
    return 0;
  }

  // Calculate bearing using atan2
  const bearing = Math.atan2(deltaLon, deltaLat) * 180 / Math.PI;
  
  // Convert to compass bearing (0° = North, 90° = East, 180° = South, 270° = West)
  // atan2 returns -180 to 180, we need 0 to 360
  const compassBearing = (bearing + 360) % 360;
  
  return compassBearing;
}