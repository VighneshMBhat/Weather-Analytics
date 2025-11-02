const { createClient } = require('@supabase/supabase-js');

// TODO: Add your Supabase URL and SERVICE_ROLE_KEY to .env
// DO NOT expose service role key to frontend!
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
} else {
  console.warn('⚠️  Supabase credentials not configured. Please add to .env');
}

/**
 * Save historical weather snapshot to Supabase
 */
async function saveHistoricalSnapshot(cityName, lat, lon, payload) {
  if (!supabase) {
    console.log('Supabase not configured, skipping historical snapshot save');
    return null;
  }

  try {
    const { data, error } = await supabase.from('historical_snapshots').insert([
      {
        city_name: cityName,
        lat: lat,
        lon: lon,
        snapshot_time: new Date().toISOString(),
        payload: payload,
      },
    ]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving historical snapshot:', error.message);
    return null;
  }
}

/**
 * Get historical snapshots for a city
 */
async function getHistoricalSnapshots(cityName, fromDate, toDate) {
  if (!supabase) {
    return { data: [], error: 'Supabase not configured' };
  }

  try {
    let query = supabase
      .from('historical_snapshots')
      .select('*')
      .eq('city_name', cityName)
      .order('snapshot_time', { ascending: false });

    if (fromDate) {
      query = query.gte('snapshot_time', fromDate);
    }
    if (toDate) {
      query = query.lte('snapshot_time', toDate);
    }

    const { data, error } = await query;
    return { data, error };
  } catch (error) {
    console.error('Error fetching historical snapshots:', error.message);
    return { data: [], error: error.message };
  }
}

/**
 * Get user favorites
 */
async function getUserFavorites(userId) {
  if (!supabase) {
    return { data: [], error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    return { data: [], error: error.message };
  }
}

/**
 * Add favorite city for user
 */
async function addFavorite(userId, cityName, lat, lon) {
  if (!supabase) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase.from('favorites').insert([
      {
        user_id: userId,
        city_name: cityName,
        lat: lat,
        lon: lon,
      },
    ]);

    return { data, error };
  } catch (error) {
    console.error('Error adding favorite:', error.message);
    return { data: null, error: error.message };
  }
}

/**
 * Remove favorite city for user
 */
async function removeFavorite(userId, cityName) {
  if (!supabase) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('city_name', cityName);

    return { data, error };
  } catch (error) {
    console.error('Error removing favorite:', error.message);
    return { data: null, error: error.message };
  }
}

/**
 * Verify Supabase JWT token (for protected endpoints)
 * Properly verifies Google OAuth JWT tokens from Supabase
 */
async function verifyToken(token) {
  if (!supabase) {
    console.error('❌ Supabase not configured');
    return { user: null, error: 'Supabase not configured' };
  }

  if (!token) {
    console.error('❌ No token provided');
    return { user: null, error: 'No token provided' };
  }

  try {
    console.log('🔍 Verifying token (length:', token.length, ')');
    
    // Create a Supabase client with the user's JWT token
    // This creates a client instance scoped to this specific user
    const { createClient } = require('@supabase/supabase-js');
    const userClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Verify the JWT token by calling getUser with the token
    // This decodes and validates the JWT
    const { data, error } = await userClient.auth.getUser(token);
    
    if (error) {
      console.error('❌ Token verification failed:', error.message);
      return { user: null, error: error.message };
    }
    
    if (!data || !data.user) {
      console.error('❌ No user data in token response');
      return { user: null, error: 'Invalid token: no user found' };
    }

    console.log('✅ Token verified successfully!');
    console.log('   User:', data.user.email);
    console.log('   User ID:', data.user.id);
    
    return { user: data.user, error: null };
  } catch (error) {
    console.error('❌ Exception during token verification:');
    console.error('   Message:', error.message);
    console.error('   Stack:', error.stack);
    return { user: null, error: error.message };
  }
}

module.exports = {
  supabase,
  saveHistoricalSnapshot,
  getHistoricalSnapshots,
  getUserFavorites,
  addFavorite,
  removeFavorite,
  verifyToken,
};
