import express from 'express';
import bodyParser from 'body-parser';
import mariadb from 'mariadb';

interface Boxer {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  height: string;
  weight: string;
  fight_number: string;
  win: string;
  losses: string;
  kos: string;
  gym_number: string;
  title: string;
  image_link: string;
  trainer_name: string;
}

interface User {
  id?: number;
  last_name: string;
  first_name: string;
  email: string;
  password: string;
}

class BoxerService {
  private pool: mariadb.Pool;
  private app: express.Application;

  constructor() {
    this.pool = mariadb.createPool({
      host: 'localhost',
      user: 'boxer',
      password: '1234',
      database: 'boxer_db',
      connectionLimit: 5,
    });

    this.app = express();
    this.app.use(bodyParser.json());

    this.app.get('/api/', this.getApi.bind(this));
    this.app.get('/api/boxers', this.getBoxers.bind(this));
    this.app.post('/api/boxers', this.addBoxer.bind(this));
    this.app.post('/api/auth/login', this.login.bind(this));
    this.app.post('/api/users', this.addUser.bind(this));
    this.app.get('/api/boxers/favorites', this.getFavorites.bind(this));
    this.app.get('/api/users', this.getUsers.bind(this));
  }

  private getApi(req: express.Request, res: express.Response): void {
    res.send('Express + TypeScript Server');
  }

  private async getBoxers(req: express.Request, res: express.Response): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      const boxers = await connection.query('SELECT * from BOXERS');
      res.json(boxers);
    } catch (error) {
      console.error('Error fetching boxers:', error);
      res.status(500).end();
    } finally {
      await connection.end();
    }
  }

  private async addBoxer(req: express.Request, res: express.Response): Promise<void> {
    const boxer: Boxer = req.body;
    console.log('Adding new boxer', boxer);
    const connection = await this.pool.getConnection();

    try {
      await connection.query(
        'INSERT INTO BOXERS (first_name, last_name, email, height, weight, fight_number, win, losses, kos, gym_number, title, image_link, trainer_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          boxer.first_name,
          boxer.last_name,
          boxer.email,
          boxer.height,
          boxer.weight,
          boxer.fight_number,
          boxer.win,
          boxer.losses,
          boxer.kos,
          boxer.gym_number,
          boxer.title,
          boxer.image_link,
          boxer.trainer_name,
        ]
      );
      res.end();
    } catch (error) {
      console.error('Error adding boxer:', error);
      res.status(500).end();
    } finally {
      await connection.end();
    }
  }

  //addUser
  private async addUser(req: express.Request, res: express.Response): Promise<void> {
    const user: User = req.body;
    console.log('Adding new user', user);
    const connection = await this.pool.getConnection();

    try {
      await connection.query(
        'INSERT INTO USERS (last_name, first_name, email, password) VALUES (?, ?, ?, ?)',
        [user.last_name, user.first_name, user.email, user.password]
      );
      res.end();
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).end();
    } finally {
      await connection.end();
    }
  }

  private async getUsers(req: express.Request, res: express.Response): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      const users = await connection.query('SELECT * from USERS');
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).end();
    } finally {
      await connection.end();
    }
  }

  // Inside the login method:
private async login(req: express.Request, res: express.Response): Promise<void> {
  const userInfo = req.body;
  console.log('User Info:', userInfo); // Add this line
  let connection = await this.pool.getConnection();
  const users = await connection.query(
    'SELECT id FROM USERS WHERE email = ? AND password = ?',
    [userInfo.email, userInfo.password]
  );
  console.log('Found users', users);
  await connection.end();
  if (users.length !== 1) {
    res.status(400).end();
  } else {
    const token = `${userInfo.email}-${Number(new Date()).toString(36)}`;
    connection = await this.pool.getConnection();
    await connection.query('INSERT INTO USERS_TOKENS (id_user, token) VALUES (?, ?)', [
      users[0].id,
      token,
    ]);
    await connection.end();
    res.json({
      token,
    });
  }
}

// Inside the getFavorites method:
private async getFavorites(req: express.Request, res: express.Response): Promise<void> {
  const authHeader = req.headers.authorization;
  console.log('Auth Header:', authHeader); // Add this line
  if (authHeader == null || !authHeader.toLowerCase().startsWith('bearer ')) {
    res.sendStatus(403);
    return;
  }
  const token = authHeader.substring('bearer '.length);
  const connection = await this.pool.getConnection();
  const userIds = await connection.query('SELECT id_user FROM USERS_TOKENS WHERE token = ?', [
    token,
  ]);
  console.log('Found user ids', userIds); // Add this line
  connection.end();
  if (userIds.length !== 1) {
    console.warn('No unique user id found', userIds);
    res.status(403).end();
    return;
  }
  const userId = userIds[0].id_user;
  console.log('User ID:', userId); // Add this line
  const favorites = await connection.query(
    `SELECT BOXERS.id, BOXERS.first_name, BOXERS.last_name, BOXERS.email, BOXERS.height, BOXERS.weight, BOXERS.fight_number, BOXERS.win, BOXERS.losses, BOXERS.kos, BOXERS.gym_number, BOXERS.title, BOXERS.image_link, BOXERS.trainer_name 
      FROM BOXERS INNER JOIN USERS_BOXERS 
      ON USERS_BOXERS.id_boxer = BOXERS.id 
      AND USERS_BOXERS.id_user = ?`,
    [userId]
  );
  res.json(favorites);
}


  public startServer(port: number): void {
    this.app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  }
}

const boxerService = new BoxerService();
const PORT = 3000;
boxerService.startServer(PORT);
