import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog Management System API',
      version: '1.0.0',
      description: 'API documentation for Blog Management System (Auth, Posts, Categories, Tags, Uploads, Comments, Likes, Bookmarks)',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            fullName: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            bio: { type: 'string' },
            avatar: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'AUTHOR', 'READER'] },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        RefreshToken: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            token: { type: 'string' },
            expiresAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            authorId: { type: 'string', format: 'uuid' },
            author: { $ref: '#/components/schemas/User' },
            categoryId: { type: 'string', format: 'uuid' },
            category: { $ref: '#/components/schemas/Category' },
            title: { type: 'string' },
            slug: { type: 'string' },
            excerpt: { type: 'string' },
            content: { type: 'string' },
            featuredImage: { type: 'string' },
            status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
            viewsCount: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            publishedAt: { type: 'string', format: 'date-time' },
            tags: { type: 'array', items: { type: 'object' } },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Tag: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            slug: { type: 'string' },
          },
        },
        CreatePostInput: {
          type: 'object',
          required: ['authorId', 'title', 'content'],
          properties: {
            authorId: {
              type: 'string',
              format: 'uuid',
              example: '079cdd69-05d4-4c6b-b8bf-9883afe4c452',
            },
            title: {
              type: 'string',
              example: 'Swagger Test Post with Author',
            },
            content: {
              type: 'string',
              example: 'This post is created via Swagger UI to verify Author linkage.',
            },
            excerpt: {
              type: 'string',
              example: 'A short summary of the post created in Swagger',
            },
            featuredImage: {
              type: 'string',
              example: 'https://example.com/images/featured.jpg',
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
              default: 'DRAFT',
              example: 'PUBLISHED',
            },
            categoryId: {
              type: 'string',
              format: 'uuid',
            },
            categoryName: {
              type: 'string',
              example: 'Software Architecture',
            },
            tagNames: {
              type: 'array',
              items: { type: 'string' },
              example: ['Swagger', 'NodeJS', 'Prisma'],
            },
            publishedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CreateCategoryInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
          },
        },
        CreateTagInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/**/*.js', './src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

export default swaggerSpec;
