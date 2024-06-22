import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";




import { verify } from 'hono/jwt';



export const blogroute = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
        UPLOADCARE_PUBLIC_KEY: string;
        UPLOADCARE_SECRET_KEY: string;
        
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

            c.status(401)
        		
        		return c.json({ error: "unauthorized" });
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


 
  
  try {
    const formData = await c.req.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    const image:any = formData.get('postImage');

    if (typeof title !== 'string' || typeof content !== 'string' ) {
        c.status(400);
        return c.json({ error: "Missing blog details or image" });
    }

    // Process the image file (e.g., upload to a storage service)
    //@ts-ignore
    const imageUrl = await uploadImageToUploadcare(image, c.env.UPLOADCARE_PUBLIC_KEY, c.env.UPLOADCARE_SECRET_KEY); 

   
    
  
   
    
    

    const blog = await prisma.post.create({
        data: {
            title: title,
            content: content,
            imageUrl: imageUrl,
            
             
            //@ts-ignore
            authorId: c.get("userId")
        }
    });

    return c.json({
        //@ts-ignore
        blog:blog
    });
} catch (error) {
    console.error('Error adding blog:', error);
    c.status(500);
    return c.json({ error: "Internal Server Error" });
}
    
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



blogroute.put('/blog/update/:id', async (c) => {
  const id = c.req.param('id');
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const formData = await c.req.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    const image = formData.get('postImage');

    if (typeof title !== 'string' || typeof content !== 'string') {
      c.status(400);
      return c.json({ error: 'Missing blog details for updating' });
    }

    // Fetch the current blog post to get the current image URL
    const currentBlog = await prisma.post.findFirst({
      where: { id },
    });

    if (!currentBlog) {
      c.status(404);
      return c.json({ error: 'Blog post not found' });
    }

    let updateData: any = {
      title,
      content,
    };

    if (image) {
      const imageUrl = await uploadImageToUploadcare(image, c.env.UPLOADCARE_PUBLIC_KEY,c.env.UPLOADCARE_SECRET_KEY);
      updateData.imageUrl = imageUrl;

      // Extract the UUID from the current image URL
      if (currentBlog.imageUrl) {
        const uuid = currentBlog.imageUrl.split('/').slice(-2, -1)[0];
        await deleteImageFromUploadcare(uuid, c.env.UPLOADCARE_PUBLIC_KEY, c.env.UPLOADCARE_SECRET_KEY);
      }
    }

    const blog = await prisma.post.update({
      where: {
        id,
      },
      data: updateData,
    });

    return c.json({ blog });
  } catch (error) {
    console.error('Error updating blog:', error);
    c.status(500);
    return c.json({ error: 'Internal Server Error' });
  }
});

blogroute.get('/getall', async (c) => {

  
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const page = parseInt(c.req.query('page') || '1', 10);
    const limit = parseInt(c.req.query('limit') || '10', 10);

    if (isNaN(page) || isNaN(limit)) {
      c.status(400)
        return c.json({ error: "Invalid page or limit" });
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
    } catch (err:any) {
      c.status(500)
        return c.json({ error: "Error in finding all posts", details: err.message });
    }
});




async function uploadImageToUploadcare(image:any, publicKey: string, secretKey: string): Promise<string> {
  const formData = new FormData();
  formData.append('UPLOADCARE_PUB_KEY', publicKey);
  formData.append('UPLOADCARE_STORE', '1');
  formData.append('file', image);

  const response = await fetch('https://upload.uploadcare.com/base/', {
      method: 'POST',
      body: formData
  });

  
  

  if (!response.ok) {
      throw new Error('Failed to upload image to Uploadcare');
  }

  const data:any = await response.json();
  return `https://ucarecdn.com/${data.file}/`;
}


async function deleteImageFromUploadcare(uuid: string, publicKey: string, secretKey: string): Promise<void> {
  const response = await fetch(`https://api.uploadcare.com/files/${uuid}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Uploadcare.Simple ${publicKey}:${secretKey}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Uploadcare delete response error:', errorText);
    throw new Error(`Failed to delete image from Uploadcare: ${errorText}`);
  }

  console.log(`Deleted image ${uuid} from Uploadcare.`);
}
