# Property Listing Backend

A robust backend system for managing property listings, featuring authentication, advanced filtering, favorites, recommendations, and caching.

## Features
- User registration/login with JWT authentication
- CRUD operations for properties (only creator can modify/delete)
- Advanced property filtering
- Favorites management
- Property recommendations
- Redis caching for performance
- CSV import script for bulk data
- Ready for deployment (Render/Vercel)

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB instance (local or Atlas)
- Redis instance (local or cloud)

### Setup
1. **Clone the repository**
   ```sh
   git clone <repo-url>
   cd backend
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Configure environment variables**
   - Copy `.env` and update values as needed:
     ```
     PORT=8000
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     REDIS_USERNAME=your_redis_username
     REDIS_PASSWORD=your_redis_password
     REDIS_HOST=your_redis_host
     REDIS_PORT=your_redis_port
     ```
4. **Import property data (optional)**
   ```sh
   npm run import:csv
   ```
5. **Start the development server**
   ```sh
   npm run dev
   ```

---

## API Reference

All routes are prefixed with `/api`.

### Authentication
#### Register
- **POST** `/api/auth/register`
- **Body:** `{ "email": string, "password": string }`
- **Response:** `201 Created | 409 Conflict | 400 Bad Request`

#### Login
- **POST** `/api/auth/login`
- **Body:** `{ "email": string, "password": string }`
- **Response:** `{ token: string }` on success

### Properties
#### Create Property
- **POST** `/api/properties/`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Property fields (see Data Models)
- **Response:** `201 Created | 400 Bad Request`

#### List Properties
- **GET** `/api/properties/`
- **Query Params:** Any property field for filtering
- **Response:** `200 OK` (array of properties)

#### Get Property
- **GET** `/api/properties/:id`
- **Response:** `200 OK` (property) | `404 Not Found`

#### Update Property
- **PUT** `/api/properties/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Fields to update
- **Response:** `200 OK | 403 Forbidden | 400 Bad Request`

#### Delete Property
- **DELETE** `/api/properties/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK | 403 Forbidden | 400 Bad Request`

### Favorites
#### Add Favorite
- **POST** `/api/favorites/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK | 409 Conflict`

#### Remove Favorite
- **DELETE** `/api/favorites/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK | 404 Not Found`

#### List Favorites
- **GET** `/api/favorites/`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK` (array)

### Recommendations
#### Recommend Property
- **POST** `/api/recommendations/`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "recipientEmail": string, "id": string }`
- **Response:** `200 OK | 404 Not Found | 409 Conflict`

#### Get Recommendations Received
- **GET** `/api/recommendations/received`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK` (array)

---

## Data Models

### User
- `email`: string
- `password`: hashed string
- `favorites`: array of Property IDs
- `recommendationsReceived`: array of Property IDs

### Property
- `propertyId`: string
- `title`: string
- `type`: string
- `price`: number
- `state`: string
- `city`: string
- `areaSqFt`: number
- `bedrooms`: number
- `bathrooms`: number
- `amenities`: string[]
- `furnished`: string
- `availableFrom`: Date
- `listedBy`: string
- `tags`: string[]
- `colorTheme`: string
- `rating`: number
- `isVerified`: boolean
- `listingType`: string
- `createdBy`: User ID

---

## Environment Variables

| Variable         | Description                |
|------------------|---------------------------|
| PORT             | Server port               |
| MONGODB_URI      | MongoDB connection string |
| JWT_SECRET       | JWT secret key            |
| REDIS_USERNAME   | Redis username            |
| REDIS_PASSWORD   | Redis password            |
| REDIS_HOST       | Redis host                |
| REDIS_PORT       | Redis port                |

---

## Deployment

- Build the project: `npm run build`
- Start in production: `npm start`
- Configurations for Render/Vercel are included.

---

## Notes
- All protected routes require a valid JWT in the `Authorization` header.
- Advanced filtering is available on the property listing endpoint via query params.
- Redis is used for caching property lists and details for performance.
- Use the provided CSV import script to bulk load properties.

---

## License
MIT License
