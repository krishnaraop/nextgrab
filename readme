# Project API Documentation

## APIs Implemented so far

### Authentication

#### 1. Register User
- **Endpoint**: `/api/auth/register`
- **Method**: `POST`
- **Parameters**: 
  - `name` (String): User name
  - `email` (String): User email
  - `phone` (String): User phone
  - `password` (String): User password

#### 2. Login User
- **Endpoint**: `/api/auth/login`
- **Method**: `POST`
- **Parameters**: 
  - `email` (String): User email
  - `password` (String): User password

### Vendor Registration

#### 1. Register Vendor
- **Endpoint**: `/api/auth/register/vendor`
- **Method**: `POST`
- **Parameters**: 
  - `name` (String): Vendor name
  - `email` (String): Vendor email
  - `phone` (String): Vendor phone
  - `password` (String): Vendor password

### Store Management

#### 1. Create Store
- **Endpoint**: `/api/stores`
- **Method**: `POST`
- **Parameters**: 
  - `name` (String): Store name
  - `description` (String): Store description
  - `address` (String): Store address
  - `location` (Object): `{ type: 'Point', coordinates: [longitude, latitude] }`

#### 2. Update Store
- **Endpoint**: `/api/stores/:storeId`
- **Method**: `PUT`
- **Parameters**: 
  - `name` (String): Store name (Optional)
  - `description` (String): Store description (Optional)
  - `category` (String): Store category (Optional)
  - `photo` (String): Store photo (Optional)

#### 3. Delete Store
- **Endpoint**: `/api/stores/:storeId`
- **Method**: `DELETE`

#### 4. Get All Stores
- **Endpoint**: `/api/stores`
- **Method**: `GET`

#### 5. Get Store by ID
- **Endpoint**: `/api/stores/:storeId`
- **Method**: `GET`

#### 6. Get Stores by Vendor
- **Endpoint**: `/api/stores/vendor/all`
- **Method**: `GET`

#### 7. Get Nearby Stores
- **Endpoint**: `/api/stores/nearby`
- **Method**: `GET`
- **Parameters**: 
  - `latitude` (Number): Latitude of the location
  - `longitude` (Number): Longitude of the location
  - `maxDistance` (Number): Maximum distance in meters (Optional)

#### 8. Get Stores by Place
- **Endpoint**: `/api/stores/geocode`
- **Method**: `GET`
- **Parameters**: 
  - `location` (String): Name of the place to search for

### Surprise Bag Management

#### 1. Create Surprise Bag
- **Endpoint**: `/api/surprise-bags`
- **Method**: `POST`
- **Parameters**: 
  - `name` (String): Surprise bag name
  - `description` (String): Description
  - `price` (Number): Price
  - `category` (String): Category (`small`, `medium`, `large`)
  - `quantity` (Number): Quantity available
  - `storeId` (String): ID of the store
  - `pickupSchedule` (Array): Array of pickup schedules

#### 2. Update Surprise Bag
- **Endpoint**: `/api/surprise-bags/:bagId`
- **Method**: `PUT`
- **Parameters**: 
  - `name` (String): Name (Optional)
  - `description` (String): Description (Optional)
  - `price` (Number): Price (Optional)
  - `quantity` (Number): Quantity (Optional)

#### 3. Delete Surprise Bag
- **Endpoint**: `/api/surprise-bags/:bagId`
- **Method**: `DELETE`

#### 4. Get All Surprise Bags by Store
- **Endpoint**: `/api/surprise-bags/store/:storeId`
- **Method**: `GET`

#### 5. Update Surprise Bag Quantity
- **Endpoint**: `/api/surprise-bags/:surpriseBagId/quantity`
- **Method**: `PUT`
- **Parameters**: 
  - `quantity` (Number): New quantity

### Order Management

#### 1. Place Order
- **Endpoint**: `/api/orders`
- **Method**: `POST`
- **Parameters**: 
  - `storeId` (String): ID of the store
  - `surpriseBagId` (String): ID of the surprise bag
  - `quantity` (Number): Quantity ordered
  - `pickupTime` (String): Pickup time

#### 2. Update Order Status
- **Endpoint**: `/api/orders/:orderId/status`
- **Method**: `PUT`
- **Parameters**: 
  - `status` (String): New status (`completed`, `canceled`, etc.)

#### 3. Get Orders for User
- **Endpoint**: `/api/orders`
- **Method**: `GET`

#### 4. Get Orders for Vendor
- **Endpoint**: `/api/orders/vendor/:storeId`
- **Method**: `GET`

#### 5. Verify Order Pickup
- **Endpoint**: `/api/orders/:orderId/verify-pickup`
- **Method**: `POST`
- **Parameters**: 
  - `pickupCode` (String): Code provided to verify the pickup

#### 6. Initiate Payment
- **Endpoint**: `/api/orders/:orderId/pay`
- **Method**: `POST`

#### 7. Confirm Payment (Webhook)
- **Endpoint**: `/api/orders/webhooks/stripe`
- **Method**: `POST`

### Notifications

#### 1. Send Notification
- **Endpoint**: `/api/notifications`
- **Method**: `POST`
- **Parameters**: 
  - `userId` (String): ID of the user
  - `title` (String): Notification title
  - `body` (String): Notification body
  - `type` (String): Notification type

#### 2. Get User Notifications
- **Endpoint**: `/api/notifications`
- **Method**: `GET`

#### 3. Mark Notification as Read
- **Endpoint**: `/api/notifications/:notificationId`
- **Method**: `PUT`

### Waitlist

#### 1. Add to Waitlist
- **Endpoint**: `/api/waitlist`
- **Method**: `POST`
- **Parameters**: 
  - `userId` (String): User ID
  - `surpriseBagId` (String): Surprise bag ID

#### 2. Get Waitlist for User
- **Endpoint**: `/api/waitlist/user/:userId`
- **Method**: `GET`

#### 3. Remove from Waitlist
- **Endpoint**: `/api/waitlist/:waitlistId`
- **Method**: `DELETE`

#### 4. Notify Waitlisted Users
- **Endpoint**: `/api/waitlist/notify`
- **Method**: `POST`
- **Parameters**: 
  - `surpriseBagId` (String): ID of the surprise bag that is available again

