const db = require('../db');
const bcrypt = require('bcryptjs');

// --- Update Email Controller ---
exports.updateEmail = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({ message: 'New email required' });
    }

    await User.update(
      { email: newEmail },
      { where: { id: userId } }
    );

    res.json({ message: 'Email updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Update Password Controller ---
exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        // 1. Fetch user from DB to verify current password
        const userResult = await db.query('SELECT * FROM users WHERE user_id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const user = userResult.rows[0];

        // 2. Compare the provided current password with the stored hash
        const isMatch = await bcrypt.compare(currentPassword, user.user_password_hash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect current password.' });
        }

        // 3. Hash the new password
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        // 4. Update the password hash in the database
        await db.query('UPDATE users SET user_password_hash = $1 WHERE user_id = $2', [newPasswordHash, userId]);

        res.json({ msg: 'Password updated successfully.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};