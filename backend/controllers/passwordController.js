/* -------------------------------------------------------------------------- */
/* File: controllers/passwordController.js                   */
/* Description: Handles logic for password CRUD and encryption.           */
/* -------------------------------------------------------------------------- */
const db = require('../db');
const crypto = require('crypto');

// Encryption constants
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY = crypto.createHash('sha256').update(String(process.env.ENCRYPTION_KEY)).digest('base64').substr(0, 32);

// Encrypt function
const encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    const encrypted = Buffer.concat([cipher.update(String(text), 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]).toString('hex');
};

// Decrypt function
const decrypt = (hash) => {
    const stringValue = Buffer.from(String(hash), 'hex');
    const iv = stringValue.slice(0, IV_LENGTH);
    const tag = stringValue.slice(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encrypted = stringValue.slice(IV_LENGTH + TAG_LENGTH);
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(tag);
    return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
};


// Get all passwords for a user
exports.getPasswords = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM passwords WHERE user_id = $1 ORDER BY website_name', [req.user.id]);
        const passwords = result.rows.map(p => ({
            ...p,
            password: decrypt(p.encrypted_password) // Decrypt for sending to client
        }));
        res.json(passwords);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Add a new password
exports.addPassword = async (req, res) => {
    const { website_name, username, password } = req.body;
    try {
        const encrypted_password = encrypt(password);
        const newPassword = await db.query(
            'INSERT INTO passwords (user_id, website_name, username, encrypted_password) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, website_name, username, encrypted_password]
        );
        res.json({
            ...newPassword.rows[0],
            password: decrypt(newPassword.rows[0].encrypted_password)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update a password
exports.updatePassword = async (req, res) => {
    const { website_name, username, password } = req.body;
    try {
        const encrypted_password = encrypt(password);
        const updatedPassword = await db.query(
            'UPDATE passwords SET website_name = $1, username = $2, encrypted_password = $3 WHERE password_id = $4 AND user_id = $5 RETURNING *',
            [website_name, username, encrypted_password, req.params.id, req.user.id]
        );
        if (updatedPassword.rows.length === 0) {
            return res.status(404).json({ msg: 'Password not found' });
        }
        res.json({
            ...updatedPassword.rows[0],
            password: decrypt(updatedPassword.rows[0].encrypted_password)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a password
exports.deletePassword = async (req, res) => {
    try {
        const deleteOp = await db.query('DELETE FROM passwords WHERE password_id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        if (deleteOp.rowCount === 0) {
            return res.status(404).json({ msg: 'Password not found' });
        }
        res.json({ msg: 'Password removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
