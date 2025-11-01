const express = require('express');
const router = express.Router();
const {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  verifyToken,
} = require('../services/supabaseService');

/**
 * Middleware to verify Supabase JWT token
 */
async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.substring(7);

  const { user, error } = await verifyToken(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  req.user = user;
  next();
}

/**
 * GET /api/favorites
 * Get user's favorite cities
 */
router.get('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await getUserFavorites(userId);

    if (error) {
      return res.status(500).json({ success: false, error: 'Failed to fetch favorites' });
    }

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch favorites',
    });
  }
});

/**
 * POST /api/favorites
 * Add a city to favorites
 * Body: { cityName, lat, lon }
 */
router.post('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { cityName, lat, lon } = req.body;

    if (!cityName || lat === undefined || lon === undefined) {
      return res.status(400).json({ error: 'cityName, lat, and lon are required' });
    }

    const { data, error } = await addFavorite(userId, cityName, parseFloat(lat), parseFloat(lon));

    if (error) {
      return res.status(500).json({ success: false, error: 'Failed to add favorite' });
    }

    res.json({
      success: true,
      data,
      message: 'Favorite added successfully',
    });
  } catch (error) {
    console.error('Error adding favorite:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add favorite',
    });
  }
});

/**
 * DELETE /api/favorites/:cityName
 * Remove a city from favorites
 */
router.delete('/:cityName', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { cityName } = req.params;

    if (!cityName) {
      return res.status(400).json({ error: 'cityName is required' });
    }

    const { data, error } = await removeFavorite(userId, decodeURIComponent(cityName));

    if (error) {
      return res.status(500).json({ success: false, error: 'Failed to remove favorite' });
    }

    res.json({
      success: true,
      data,
      message: 'Favorite removed successfully',
    });
  } catch (error) {
    console.error('Error removing favorite:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to remove favorite',
    });
  }
});

module.exports = router;
