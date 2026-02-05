const asyncHandler = require('../utils/asyncHandler');
const { findUserByEmail, verifyPassword } = require('../services/authService');
const { signToken } = require('../utils/jwt');
const db = require('../config/database');

// Auth
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const user = await findUserByEmail(email);
  const allowed = new Set(['admin', 'manager', 'journalist']);
  if (!user || !allowed.has(user.role)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken({ id: user.id, role: user.role, role_id: user.role_id });
  res.json({ token, user: { email: user.email, full_name: user.full_name, role: user.role } });
});

exports.verify = asyncHandler(async (req, res) => {
  // Get user details from database using req.user.id
  const [rows] = await db.execute('SELECT email, full_name, photo_url FROM users WHERE id = ?', [req.user.id]);
  const user = rows[0];
  
  res.json({ 
    user: { 
      email: user?.email || 'admin@radioagakiza.com',
      full_name: user?.full_name || 'Admin User',
      photo_url: user?.photo_url || null,
      role: req.user.role
    } 
  });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { full_name, current_password, new_password } = req.body;
  
  // Get current user
  const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [req.user.id]);
  const user = userRows[0];
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // If changing password, verify current password
  if (new_password && current_password) {
    const { verifyPassword, hashPassword } = require('../services/authService');
    const isValid = await verifyPassword(current_password, user.password_hash);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    const hashedPassword = await hashPassword(new_password);
    await db.execute(
      'UPDATE users SET full_name = ?, password_hash = ? WHERE id = ?',
      [full_name, hashedPassword, req.user.id]
    );
  } else {
    // Update only full name
    await db.execute(
      'UPDATE users SET full_name = ? WHERE id = ?',
      [full_name, req.user.id]
    );
  }
  
  res.json({ 
    user: { 
      email: user.email,
      full_name: full_name
    } 
  });
});

exports.uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  // Simple file handling - in production, use cloud storage
  const fileName = `profile_${req.user.id}_${Date.now()}.${req.file.originalname.split('.').pop()}`;
  const fs = require('fs');
  const path = require('path');
  
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, req.file.buffer);
  
  const photoUrl = `/uploads/${fileName}`;
  
  // Update user photo_url in database
  await db.execute('UPDATE users SET photo_url = ? WHERE id = ?', [photoUrl, req.user.id]);
  
  res.json({ photo_url: photoUrl });
});

// Users CRUD
exports.getUsers = asyncHandler(async (req, res) => {
  const [rows] = await db.execute(`
    SELECT u.id, u.email, u.full_name, r.name as role, u.created_at 
    FROM users u
    JOIN roles r ON u.role_id = r.id
    ORDER BY u.created_at DESC
  `);
  res.json({ users: rows });
});

exports.createUser = asyncHandler(async (req, res) => {
  const { email, full_name, role, password } = req.body;
  
  if (!email || !full_name || !role || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Get role_id
  const [roleRows] = await db.execute('SELECT id FROM roles WHERE name = ?', [role]);
  if (roleRows.length === 0) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  // Check if email already exists for the same role
  const [existing] = await db.execute('SELECT id FROM users WHERE email = ? AND role_id = ? LIMIT 1', [email, roleRows[0].id]);
  if (existing.length > 0) {
    return res.status(400).json({ error: 'Email already exists for this role' });
  }
  
  const { hashPassword } = require('../services/authService');
  const hashedPassword = await hashPassword(password);
  
  try {
    const [result] = await db.execute(
      'INSERT INTO users (email, full_name, role_id, password_hash) VALUES (?, ?, ?, ?)',
      [email, full_name, roleRows[0].id, hashedPassword]
    );
    res.json({ id: result.insertId, message: 'User created successfully' });
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists (duplicate)' });
    }
    throw err;
  }
});

exports.updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email, full_name, role, password } = req.body;
  
  if (!email || !full_name || !role) {
    return res.status(400).json({ error: 'Email, full name, and role are required' });
  }
  
  // Get role_id
  const [roleRows] = await db.execute('SELECT id FROM roles WHERE name = ?', [role]);
  if (roleRows.length === 0) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  // Check if email exists for other users with the same role
  const [existing] = await db.execute('SELECT id FROM users WHERE email = ? AND role_id = ? AND id != ? LIMIT 1', [email, roleRows[0].id, id]);
  if (existing.length > 0) {
    return res.status(400).json({ error: 'Email already exists for this role' });
  }
  
  if (password) {
    const { hashPassword } = require('../services/authService');
    const hashedPassword = await hashPassword(password);
    try {
      await db.execute(
        'UPDATE users SET email = ?, full_name = ?, role_id = ?, password_hash = ? WHERE id = ?',
        [email, full_name, roleRows[0].id, hashedPassword, id]
      );
    } catch (err) {
      if (err && err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Email already exists (duplicate)' });
      }
      throw err;
    }
  } else {
    try {
      await db.execute(
        'UPDATE users SET email = ?, full_name = ?, role_id = ? WHERE id = ?',
        [email, full_name, roleRows[0].id, id]
      );
    } catch (err) {
      if (err && err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Email already exists (duplicate)' });
      }
      throw err;
    }
  }
  
  res.json({ message: 'User updated successfully' });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Prevent deleting yourself
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }
  
  await db.execute('DELETE FROM users WHERE id = ?', [id]);
  res.json({ message: 'User deleted successfully' });
});

// Programs
exports.getPrograms = asyncHandler(async (req, res) => {
  const [rows] = await db.execute(`
    SELECT p.*, h.full_name as host_name, ps.day_of_week, ps.start_time, ps.end_time
    FROM programs p
    LEFT JOIN program_hosts ph ON p.id = ph.program_id AND ph.is_primary = 1
    LEFT JOIN hosts h ON ph.host_id = h.id
    LEFT JOIN program_schedule ps ON p.id = ps.program_id AND ps.is_active = 1
    WHERE p.is_active = 1
    ORDER BY p.name
  `);
  res.json(rows);
});

exports.createProgram = asyncHandler(async (req, res) => {
  const { name, host, day_of_week, start_time, end_time } = req.body;
  
  const [result] = await db.execute(
    'INSERT INTO programs (name, slug, created_by) VALUES (?, ?, ?)',
    [name, name.toLowerCase().replace(/\s+/g, '-'), req.user.id]
  );
  
  if (host) {
    const [hostResult] = await db.execute(
      'INSERT INTO hosts (full_name) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
      [host]
    );
    
    await db.execute(
      'INSERT INTO program_hosts (program_id, host_id, is_primary) VALUES (?, ?, 1)',
      [result.insertId, hostResult.insertId]
    );
  }
  
  if (day_of_week !== undefined && start_time && end_time) {
    await db.execute(
      'INSERT INTO program_schedule (program_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)',
      [result.insertId, day_of_week, start_time, end_time]
    );
  }
  
  res.json({ id: result.insertId, message: 'Program created' });
});

exports.updateProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, host, day_of_week, start_time, end_time } = req.body;
  
  await db.execute('UPDATE programs SET name = ?, slug = ? WHERE id = ?', 
    [name, name.toLowerCase().replace(/\s+/g, '-'), id]);
  
  if (host) {
    await db.execute('DELETE FROM program_hosts WHERE program_id = ?', [id]);
    const [hostResult] = await db.execute(
      'INSERT INTO hosts (full_name) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
      [host]
    );
    await db.execute(
      'INSERT INTO program_hosts (program_id, host_id, is_primary) VALUES (?, ?, 1)',
      [id, hostResult.insertId]
    );
  }
  
  if (day_of_week !== undefined && start_time && end_time) {
    await db.execute('DELETE FROM program_schedule WHERE program_id = ?', [id]);
    await db.execute(
      'INSERT INTO program_schedule (program_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)',
      [id, day_of_week, start_time, end_time]
    );
  }
  
  res.json({ message: 'Program updated' });
});

exports.deleteProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await db.execute('UPDATE programs SET is_active = 0 WHERE id = ?', [id]);
  res.json({ message: 'Program deleted' });
});

// News
exports.getNews = asyncHandler(async (req, res) => {
  if (req.user.role === 'journalist') {
    const [rows] = await db.execute(`
      SELECT a.*, u.full_name as author_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.author_id = ?
      ORDER BY a.created_at DESC
    `, [req.user.id]);
    res.json(rows);
  } else {
    const [rows] = await db.execute(`
      SELECT a.*, u.full_name as author_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      ORDER BY a.created_at DESC
    `);
    res.json(rows);
  }
});

exports.createNews = asyncHandler(async (req, res) => {
  const { title, content, status = 'draft', image_thumbnail, image_medium, image_large } = req.body;
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  const [result] = await db.execute(
    'INSERT INTO articles (title, slug, content, status, author_id, published_at, image_thumbnail, image_medium, image_large, cover_image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      title,
      slug,
      content,
      status,
      req.user.id,
      status === 'published' ? new Date() : null,
      image_thumbnail,
      image_medium,
      image_large,
      image_large || image_medium || image_thumbnail || null
    ]
  );
  
  res.json({ id: result.insertId, message: 'Article created' });
});

exports.updateNews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, status, image_thumbnail, image_medium, image_large } = req.body;
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  // Journalists can only update their own articles
  if (req.user.role === 'journalist') {
    const [rows] = await db.execute('SELECT author_id FROM articles WHERE id = ?', [id]);
    if (!rows.length || rows[0].author_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }
  
  await db.execute(
    'UPDATE articles SET title = ?, slug = ?, content = ?, status = ?, published_at = ?, image_thumbnail = ?, image_medium = ?, image_large = ?, cover_image_url = ? WHERE id = ?',
    [
      title,
      slug,
      content,
      status,
      status === 'published' ? new Date() : null,
      image_thumbnail,
      image_medium,
      image_large,
      image_large || image_medium || image_thumbnail || null,
      id
    ]
  );
  
  res.json({ message: 'Article updated' });
});

exports.deleteNews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Journalists can only delete their own articles
  if (req.user.role === 'journalist') {
    const [rows] = await db.execute('SELECT author_id FROM articles WHERE id = ?', [id]);
    if (!rows.length || rows[0].author_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }
  await db.execute('DELETE FROM articles WHERE id = ?', [id]);
  res.json({ message: 'Article deleted' });
});

// Podcasts
exports.getPodcasts = asyncHandler(async (req, res) => {
  if (req.user.role === 'journalist') {
    const [rows] = await db.execute(`
      SELECT pe.*, ps.title as series_title
      FROM podcast_episodes pe
      LEFT JOIN podcast_series ps ON pe.series_id = ps.id
      WHERE pe.created_by = ?
      ORDER BY pe.created_at DESC
    `, [req.user.id]);
    res.json(rows);
  } else {
    const [rows] = await db.execute(`
      SELECT pe.*, ps.title as series_title
      FROM podcast_episodes pe
      LEFT JOIN podcast_series ps ON pe.series_id = ps.id
      ORDER BY pe.created_at DESC
    `);
    res.json(rows);
  }
});

exports.createPodcast = asyncHandler(async (req, res) => {
  const { title, description, audio_url, series_title = 'Default Series', image_thumbnail, image_medium, image_large } = req.body;
  
  // Get or create series
  let [series] = await db.execute('SELECT id FROM podcast_series WHERE title = ?', [series_title]);
  if (series.length === 0) {
    const [seriesResult] = await db.execute(
      'INSERT INTO podcast_series (title, slug, author_id) VALUES (?, ?, ?)',
      [series_title, series_title.toLowerCase().replace(/\s+/g, '-'), req.user.id]
    );
    series = [{ id: seriesResult.insertId }];
  }
  
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const [result] = await db.execute(
    'INSERT INTO podcast_episodes (series_id, title, slug, description, audio_url, image_thumbnail, image_medium, image_large, status, created_by, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [series[0].id, title, slug, description, audio_url, image_thumbnail, image_medium, image_large, 'published', req.user.id, new Date()]
  );
  
  res.json({ id: result.insertId, message: 'Podcast created' });
});

exports.updatePodcast = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, audio_url, image_thumbnail, image_medium, image_large } = req.body;
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  // Journalists can only update their own episodes
  if (req.user.role === 'journalist') {
    const [rows] = await db.execute('SELECT created_by FROM podcast_episodes WHERE id = ?', [id]);
    if (!rows.length || rows[0].created_by !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }
  
  await db.execute(
    'UPDATE podcast_episodes SET title = ?, slug = ?, description = ?, audio_url = ?, image_thumbnail = ?, image_medium = ?, image_large = ? WHERE id = ?',
    [title, slug, description, audio_url, image_thumbnail, image_medium, image_large, id]
  );
  
  res.json({ message: 'Podcast updated' });
});

exports.deletePodcast = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Journalists can only delete their own episodes
  if (req.user.role === 'journalist') {
    const [rows] = await db.execute('SELECT created_by FROM podcast_episodes WHERE id = ?', [id]);
    if (!rows.length || rows[0].created_by !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }
  await db.execute('DELETE FROM podcast_episodes WHERE id = ?', [id]);
  res.json({ message: 'Podcast deleted' });
});

// Testimonials
exports.getTestimonials = asyncHandler(async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM testimonials ORDER BY created_at DESC');
  res.json(rows);
});

exports.createTestimonial = asyncHandler(async (req, res) => {
  const { author_name, role, message, is_published = false } = req.body;
  
  const [result] = await db.execute(
    'INSERT INTO testimonials (author_name, role, message, is_published, created_by, published_at) VALUES (?, ?, ?, ?, ?, ?)',
    [author_name, role, message, is_published, req.user.id, is_published ? new Date() : null]
  );
  
  res.json({ id: result.insertId, message: 'Testimonial created' });
});

exports.updateTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { author_name, role, message, is_published } = req.body;
  
  await db.execute(
    'UPDATE testimonials SET author_name = ?, role = ?, message = ?, is_published = ?, published_at = ? WHERE id = ?',
    [author_name, role, message, is_published, is_published ? new Date() : null, id]
  );
  
  res.json({ message: 'Testimonial updated' });
});

exports.deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await db.execute('DELETE FROM testimonials WHERE id = ?', [id]);
  res.json({ message: 'Testimonial deleted' });
});

// Settings
exports.getStreamSettings = asyncHandler(async (req, res) => {
  const [rows] = await db.execute('SELECT settings_value FROM app_settings WHERE settings_key = ?', ['stream.live_url']);
  const streamUrl = rows.length > 0 ? rows[0].settings_value : 'https://cast6.asurahosting.com/proxy/radioaga/stream';
  res.json({ stream_url: streamUrl });
});

exports.updateStreamSettings = asyncHandler(async (req, res) => {
  const { stream_url } = req.body;
  
  await db.execute(
    'INSERT INTO app_settings (settings_key, settings_value, updated_by) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE settings_value = VALUES(settings_value), updated_by = VALUES(updated_by)',
    ['stream.live_url', stream_url, req.user.id]
  );
  
  res.json({ message: 'Stream URL updated' });
});
