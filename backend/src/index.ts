import { Hono } from 'hono'
import { userRouter } from '../routes/userroute';
import { blogroute } from '../routes/blogroute';


export const app = new Hono<{
  Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
  }
}>();

app.route('/api/v1/user', userRouter)
app.route('/api/v1', blogroute)

app.get('/', (c) => {
    return c.json({ message: 'Hello World' })
})







// Create the main Hono app








export default app;
