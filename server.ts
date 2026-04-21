import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import path from "path";
import db from "./db";

console.log("Starting TronBlock Matrix Server...");

async function startServer() {
  const operatorKey = process.env.PLATFORM_OPERATOR_PRIVATE_KEY;
  if (!operatorKey || operatorKey.includes("ac0974be")) {
    console.warn("⚠️ WARNING: Running with Dummy Operator Key. On-chain transfers will not be signed.");
  }

  try {
    const app = express();
    const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Configuration Center (Source of Truth)
  const systemRules = {
    version: "V2026.04.19",
    effectiveTime: "2026-04-19T00:00:00Z",
    entryPrice: 80,
    maxLevel: 10,
    currency: "USDT",
    networks: ["TRX", "BSC", "ETH"],
    levelProgression: Array.from({length: 10}, (_, i) => ({ 
      level: i+1, 
      price: 80 * Math.pow(2, i),
      directReq: i === 0 ? 3 : (i === 9 ? 2 : 3),
      reqLevel: i === 0 ? 0 : (i === 9 ? 9 : i)
    })),
    rulesText: {
      activateSeat: "Entry fee is {entryPrice} {currency}. Grants 1 membership position on the {network} network with instant smart contract verification.",
      publicMatrix: "Automated global spillover system. Earn from the total volume of the protocol regardless of direct rank.",
      teamPerformance: "Differential bonus logic up to 10%. Team development triggers cascading rewards throughout the entire structure.",
      differential: "For every seat joined, 10% ({spreadAmount} {currency}) is reserved for the extreme spread pool, distributed up 10 levels.",
      matrixRules: "The global matrix operates on a left-to-right, top-to-bottom filling mechanism ensuring no seat is left behind."
    }
  };

  // API ROUTES
  app.get("/api/config", (req, res) => {
    try {
      const configRow = db.prepare('SELECT value FROM system_config WHERE key = ?').get('main_config') as any;
      if (configRow) {
         res.json(JSON.parse(configRow.value));
      } else {
         // Insert default and return
         db.prepare('INSERT INTO system_config (key, value) VALUES (?, ?)').run('main_config', JSON.stringify(systemRules));
         res.json(systemRules);
      }
    } catch(e) {
      res.json(systemRules);
    }
  });

  // Banners Endpoints
  app.get("/api/banners", (req, res) => {
     try {
        const banners = db.prepare('SELECT * FROM global_banners WHERE is_active = 1 ORDER BY created_at DESC').all();
        res.json(banners);
     } catch (e) {
        res.json([]);
     }
  });

  // Admin Login Endpoint
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    // In a real app, use hashed passwords from DB, env vars are fine for preview/prototype
    if (username === 'admin' && password === 'admin123') {
       res.json({ success: true, token: 'dev_admin_token_2026' });
    } else {
       res.status(401).json({ error: 'Invalid admin credentials' });
    }
  });

  // Public User APIs
  app.get("/api/user/:address", (req, res) => {
    try {
      const address = req.params.address;
      let user = db.prepare('SELECT account_mode, validSeats, totalTeamVolume, joinedDate FROM users WHERE address = ?').get(address) as any;
      
      // Auto-register if not exists
      if (!user) {
        db.prepare('INSERT INTO users (address, joinedDate) VALUES (?, ?)').run(address, new Date().toISOString());
        user = db.prepare('SELECT account_mode, validSeats, totalTeamVolume, joinedDate FROM users WHERE address = ?').get(address) as any;
      }
      
      const seats = db.prepare('SELECT * FROM seats WHERE owner_address = ? ORDER BY timestamp DESC').all(address);
      const txs = db.prepare('SELECT * FROM transactions WHERE address = ? ORDER BY timestamp DESC LIMIT 50').all(address);
      
      res.json({ user, seats, transactions: txs });
    } catch (e) {
      res.status(500).json({ error: 'DB Error' });
    }
  });

  app.post("/api/seat/purchase", (req, res) => {
    try {
      const { address } = req.body;
      const user = db.prepare('SELECT * FROM users WHERE address = ?').get(address) as any;
      
      if (!user) return res.status(404).json({ error: 'User not found' });
      
      const id = Date.now().toString(); 
      const hash = `0x${Math.random().toString(16).slice(2, 40)}`;
      const amount = 80;

      const processPurchase = db.transaction(() => {
        // Create Seat
        db.prepare(`
          INSERT INTO seats (id, owner_address, level, origin, participation_status, rewards, tx_hash, timestamp)
          VALUES (?, ?, 1, 'Self Purchase', 'Active Participant', 0, ?, ?)
        `).run(id, address, hash, new Date().toISOString());

        // Increment User stats
        db.prepare('UPDATE users SET validSeats = validSeats + 1, total_deducted = total_deducted + ? WHERE address = ?').run(amount, address);

        // Record TX
        db.prepare(`
          INSERT INTO transactions (id, address, type, amount, status, timestamp, to_address)
          VALUES (?, ?, 'Seat Deduction', ?, 'COMPLETED', ?, 'Smart Contract Control')
        `).run(hash, address, amount, new Date().toISOString());

        // Referrer Logic: Give 10 USDT to referrer
        if (user.referrer) {
           db.prepare('UPDATE users SET earnings = earnings + 10, totalTeamVolume = totalTeamVolume + ? WHERE address = ?').run(amount, user.referrer);
           // Also record a transaction for the referrer
           const refHash = `0x${Math.random().toString(16).slice(2, 40)}`;
           db.prepare(`
              INSERT INTO transactions (id, address, type, amount, status, timestamp, from_address)
              VALUES (?, ?, 'Referral Reward', 10, 'PAID', ?, ?)
           `).run(refHash, user.referrer, new Date().toISOString(), address);
        }
      });

      processPurchase();
      res.json({ success: true, hash });
    } catch (e) {
      console.error("Purchase error", e);
      res.status(500).json({ error: 'Failed to purchase seat' });
    }
  });

  // Admin Middleware
  const checkAdminAuth = (req: any, res: any, next: any) => {
    const auth = req.headers.authorization;
    if (auth === 'Bearer dev_admin_token_2026') {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized Admin Access' });
    }
  };

  // Admin APIs
  app.get("/api/admin/users", checkAdminAuth, (req, res) => {
    try {
      const stmt = db.prepare('SELECT address, level, joinedDate, totalTeamVolume, validSeats, IFNULL(account_mode, "USER") as account_mode, IFNULL(is_banned, 0) as is_banned FROM users ORDER BY joinedDate DESC');
      const users = stmt.all();
      res.json(users);
    } catch (e) {
      res.status(500).json({ error: 'DB Error' });
    }
  });

  // Admin Config
  app.post("/api/admin/config", checkAdminAuth, (req, res) => {
     try {
       db.prepare('UPDATE system_config SET value = ? WHERE key = ?').run(JSON.stringify(req.body), 'main_config');
       res.json({ success: true });
     } catch (e) {
       res.status(500).json({ error: 'Failed to update config' });
     }
  });

  // Admin Banners
  app.post("/api/admin/banners", checkAdminAuth, (req, res) => {
    try {
      const { message, type } = req.body;
      const id = Date.now().toString();
      db.prepare('INSERT INTO global_banners (id, message, type, is_active, created_at) VALUES (?, ?, ?, 1, ?)').run(id, message, type || 'info', new Date().toISOString());
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to create banner' });
    }
  });

  app.delete("/api/admin/banners/:id", checkAdminAuth, (req, res) => {
    try {
      db.prepare('DELETE FROM global_banners WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete banner' });
    }
  });

  app.post("/api/admin/users/:address/ban", checkAdminAuth, (req, res) => {
    const { address } = req.params;
    const { action } = req.body; // 'ban' or 'unban'
    const status = action === 'ban' ? 1 : 0;
    
    try {
      try { db.exec(`ALTER TABLE users ADD COLUMN is_banned INTEGER DEFAULT 0;`); } catch(e) {}
      
      const stmt = db.prepare('UPDATE users SET is_banned = ? WHERE address = ?');
      stmt.run(status, address);
      res.json({ success: true, banned: status === 1 });
    } catch (e) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  app.post("/api/auth", (req, res) => {
    const { address, referrer } = req.body;
    if (!address) return res.status(400).json({ error: "Address required" });

    // Maintenance schema updates
    try { 
      db.exec(`ALTER TABLE users ADD COLUMN is_banned INTEGER DEFAULT 0;`);
      db.exec(`ALTER TABLE users ADD COLUMN referrer TEXT;`);
      db.exec(`ALTER TABLE users ADD COLUMN has_approved INTEGER DEFAULT 0;`);
      db.exec(`ALTER TABLE users ADD COLUMN total_deducted REAL DEFAULT 0.0;`);
    } catch(e) {}

    let user = db.prepare('SELECT * FROM users WHERE address = ?').get(address) as any;
    
    if (user?.is_banned === 1) {
       return res.status(403).json({ error: "Account Banned" });
    }

    if (!user) {
      const joinedDate = new Date().toISOString().split('T')[0];
      const mode = 'USER';
      db.prepare('INSERT INTO users (address, level, joinedDate, account_mode, referrer) VALUES (?, ?, ?, ?, ?)').run(address, 1, joinedDate, mode, referrer || null);
      
      // If referrer exists, increment their directReferrals
      if (referrer) {
         db.prepare('UPDATE users SET directReferrals = directReferrals + 1 WHERE address = ?').run(referrer);
      }
      
      user = db.prepare('SELECT * FROM users WHERE address = ?').get(address) as any;
      res.json(user);
    } else {
      res.json(user);
    }
  });

  app.post("/api/user/mark-approved", (req, res) => {
    const { address } = req.body;
    try {
      db.prepare('UPDATE users SET has_approved = 1 WHERE address = ?').run(address);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'DB Error' });
    }
  });

  app.post("/api/withdraw", (req, res) => {
    const { address, amount } = req.body;
    if (!address || !amount) return res.status(400).json({ error: "Params required" });
    try {
       const user = db.prepare('SELECT * FROM users WHERE address = ?').get(address) as any;
       if (!user) return res.status(404).json({ error: "User not found" });
       if (user.earnings < amount) return res.status(400).json({ error: "Insufficient balance" });

       const hash = `0x${Math.random().toString(16).slice(2, 40)}`;
       db.prepare('UPDATE users SET earnings = earnings - ? WHERE address = ?').run(amount, address);
       db.prepare(`
          INSERT INTO transactions (id, address, type, amount, status, timestamp, to_address)
          VALUES (?, ?, 'Withdrawal', ?, 'PENDING', ?, ?)
       `).run(hash, address, amount, new Date().toISOString(), address);

       res.json({ success: true, hash });
    } catch (e) {
       res.status(500).json({ error: "Failed" });
    }
  });

  app.get("/api/admin/transactions", (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader.split(' ')[1] !== 'mock-token') return res.status(401).json({ error: 'Unauthorized' });
    
    try {
      const txs = db.prepare('SELECT * FROM transactions ORDER BY timestamp DESC LIMIT 500').all();
      res.json(txs);
    } catch (e) {
      res.status(500).json({ error: 'DB Error' });
    }
  });

  app.get("/api/users/:address", (req, res) => {
    const user = db.prepare('SELECT * FROM users WHERE address = ?').get(req.params.address);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });

  app.get("/api/users/:address/seats", (req, res) => {
    const seats = db.prepare('SELECT * FROM seats WHERE owner_address = ? ORDER BY timestamp DESC').all(req.params.address);
    res.json(seats);
  });

  app.get("/api/users/:address/transactions", (req, res) => {
    const limit = parseInt(req.query.limit as string) || 50;
    const txs = db.prepare('SELECT * FROM transactions WHERE address = ? ORDER BY timestamp DESC LIMIT ?').all(req.params.address, limit);
    res.json(txs);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
  } catch (err) {
    console.error("Initialization error:", err);
  }
}

startServer().catch(err => {
  console.error("FAILED TO START SERVER:", err);
});
