import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";


import { verify } from 'hono/jwt';



export const blogroute = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
        
    }
}>();



blogroute.use('/blog/*', async (c, next) => {
	try {
        const jwt = c.req.header('Authorization');
        	if (!jwt) {
        		c.status(401);
        		return c.json({ error: "unauthorized" });
        	}
        	const token = jwt.split(' ')[1];
        	const payload = await verify(token, c.env.JWT_SECRET);
        	if (!payload) {
        		
        		return c.status(401).json({ error: "unauthorized" });
        	} 
            
            
            //@ts-ignore
        	c.set('userId', payload.id);
        	await next()
    } catch (err) {
        return c.json({error:"you are not logged in", err
        });
    }
})

blogroute.post('/blog/add', async(c) => {


    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
    
      const body = await c.req.json();
      
      

      if (!body) {
        c.status(401);
        return c.json({ error: "Missing the blog details" });
        
      }
    
      const blog = await prisma.post.create({
        data: {
          title: body.title,
          content: body.content,
            //@ts-ignore
          authorId:c.get("userId")
        }
      })

      return c.json({
          //@ts-ignore
        id: blog.id
      })

	
})

blogroute.get('/getone/:id', async (c) => {

    
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());

   try {
     const id  = c.req.param('id')
 
     if (!id) {
         return c.json({error:"Missing the post id"})
     }

     
     
 	
     const blog = await prisma.post.findFirst({
         where:{
             id:id
         }
     })
 
     return c.json({
         blog
     })
   } catch (err) {
    return c.json({error:"Couldn't find post", err});
   }
});



blogroute.put('/blog/update/:id',async (c) => {
	const id = c.req.param('id')
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
    
      const body = await c.req.json();

      if (!body) {
        c.status(401);
        return c.json({ error: "Missing the blog details for updating" });
        
      }
    
      const blog = await prisma.post.update({
        where:{
            id:id
        },
        data: {
          title: body.title,
          content: body.content,
           
        }
      })

      return c.json({
         blog
      })
})

blogroute.get('/getall', async (c) => {

  
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const page = parseInt(c.req.query('page') || '1', 10);
    const limit = parseInt(c.req.query('limit') || '10', 10);

    if (isNaN(page) || isNaN(limit)) {
        return c.status(400).json({ error: "Invalid page or limit" });
    }

    try {
        const skip = (page - 1) * limit;

        const [blogs, totalCount] = await prisma.$transaction([
            prisma.post.findMany({
                skip: skip,
                take: limit
            }),
            prisma.post.count()
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return c.json({
            blogs,
            page,
            limit,
            totalPages,
            totalCount
        });
    } catch (err) {
        return c.status(500).json({ error: "Error in finding all posts", details: err.message });
    }
});

