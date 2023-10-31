import express from 'express';
const router = express.Router(); // You need to call express.Router() to create a router instance

router.post('/register', (req, res) => {
    const { aadhar, location } = req.body;

    // Store the user data in your database (This part depends on your database setup)

    res.status(200).json({ message: 'User registered successfully' });
});

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers

    // Convert latitude and longitude from degrees to radians
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Calculate the distance
    const distance = R * c;
    return distance;
}

function detectCrowd(userLocation, allLocations) {
    // Define the number of nearest users you want to find
    const numNearestUsers = 3;

    // Sort the locations based on distance from the user
    allLocations.sort((a, b) => {
        const distanceA = calculateDistance(userLocation.lat, userLocation.lon, a.lat, a.lon);
        const distanceB = calculateDistance(userLocation.lat, userLocation.lon, b.lat, b.lon);
        return distanceA - distanceB;
    });

    // Select the nearest users, up to the specified number
    const nearestUsers = allLocations.slice(0, numNearestUsers);

    // Return the Aadhar card information and location coordinates of the nearest users
    return nearestUsers;
}

router.post('/fetch-nearby-users', (req, res) => {
    const { userLocation } = req.body;

    // Retrieve all user locations from the database (You need to implement this part)
    const allLocations = getAllLocations(); // Implement the logic to fetch user locations

    // Detect the nearest users
    const nearestUsers = detectCrowd(userLocation, allLocations);

    res.status(200).json({ nearestUsers });
});

export default router;
