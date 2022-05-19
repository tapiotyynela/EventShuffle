import express, {Request, Response} from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import eventRoutes from './routes/event'
import Person from './models/person'
import sequelize, { initializeDb } from './db';
import Event from './models/event';
import EventDate from './models/eventDate';
import Vote from './models/vote';
import VoteEventDate from './models/voteEventDate';

dotenv.config()
const app = express();

const port = process.env.PORT

initializeDb([Person, Event, EventDate, Vote, VoteEventDate])

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, async () => {
    try {
      await sequelize.authenticate();
      if (process.env.NODE_ENV !== 'test') await sequelize.sync({ alter: true })
      if (process.env.NODE_ENV !== 'test') console.log('Connection has been established successfully.');
      
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
    if (process.env.NODE_ENV !== 'test') return console.log(`Express is listening at port:${process.env.PORT}`);
  });
}

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3001'  
}))

app.get('/api/health', (req: Request, res: Response) => {
    res.send('API up.')
})

app.use('/api/v1', eventRoutes)

export default app

