import { Hono } from 'hono'
import { userRouter } from '../routes/userroute';
import { blogroute } from '../routes/blogroute';
import { cors } from 'hono/cors'
import { Context, Next } from 'hono';


type Env = {
  RATE_LIMITER: KVNamespace;
};
export const app = new Hono<{
  Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
      
  }
}>();



const rateLimiter = (limit: number, window: number) => {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const kv = c.env.RATE_LIMITER;

    // Generate a unique key for rate limiting
    //@ts-ignore
    const clientKey = `${c.req.method}-${c.req.url}-${c.req.raw.headers.get('user-agent')}`;

    if (!clientKey) {
      return c.json({ error: 'Client identifier not found' }, 400);
    }

    const key = `rate_limit_${clientKey}`;

    const currentCount = await kv.get(key);
    const count = currentCount ? parseInt(currentCount, 10) : 0;

    console.log(count);
    

    if (count >= limit) {
      return c.json({ error: 'Rate limit exceeded' }, 429);
    }

    await kv.put(key, (count + 1).toString(), { expirationTtl: window });
    await next();
  };
};

app.use('*', cors())
app.use(rateLimiter(50, 60));



app.route('/api/v1/user', userRouter)
app.route('/api/v1', blogroute)

app.get('/', (c) => {
    return c.json({ message: 'Hello World' })
})
















export default app;
