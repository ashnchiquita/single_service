# Single Service
A single service web application made by Chiquita Ahsanunnisa (13521129) to fulfill Seleksi 3 Programming Laboratory 2023 tasks.

# Author
Chiquita Ahsanunnisa (13521129)

# Tech Stack
- npm @9.7.1
- TypeScript @^5.1.6
- Next @13.4.12
- Prisma @^5.0.0
- Prisma Client @^5.0.0
- ESLint @8.45.0
- Jose @^4.14.4
- PostgreSQL 15

# How To Run
## Migration Command
1. Run `npx prisma migrate dev`

## Seeding Command
1. Create csv files (`admin.csv`, `barang.csv`, `perusahaan.csv`) inside `./prisma/data/`
2. Put seed data inside those files
3. Run `npx prisma db seed`

## Run Command
1. Run `npm i`
2. Create `.env` folder in `root` directory
3. Put your database URL (`DATABASE_URL`), JWT secret key (`JWT_SECRET_KEY`), and JWT expiration time in minutes (`JWT_EXPIRATION_TIME`) in `.env` file
4. Run migration command and if needed, run seeding command
5. Run `npm run dev`
6. App will run at `http://localhost:3000`

# Endpoints
- POST `/login`
- GET `/self `
- GET, POST `/barang`
- GET, PUT, DELETE `/barang/:id`
- GET, POST `/perusahaan`
- GET, PUT, DELETE `/perusahaan/:id`

# Bonuses Done

## B03 - Single Service Implementation
Single service implemented using TypeScript with string typing, no `as` and `any` keywoard, and runtime type checking.

## B05 - Lighthouse
1. Login (`/login`) with average score 95.5\
![Screen Shot 2023-07-29 at 19 09 15](https://github.com/ashnchiquita/single_service/assets/88751131/3625d59e-7fe1-4661-873e-ead108dccf83)

2. Register (`/register`) with average score 95.5\
![Screen Shot 2023-07-29 at 19 08 09](https://github.com/ashnchiquita/single_service/assets/88751131/b2b7a3ff-7f67-4d9d-8d5d-dadd28b8e628)

3. Store (`/store`) with average score 97.5\
![Screen Shot 2023-07-29 at 19 09 55](https://github.com/ashnchiquita/single_service/assets/88751131/9b29c650-7892-4309-a4fb-2adfd1fd351d)

4. Product (`/product/{product_id}`) with average score 96.25\
![Screen Shot 2023-07-29 at 19 10 37](https://github.com/ashnchiquita/single_service/assets/88751131/14c80be3-fe9b-4a1d-a129-ccb2ae417da8)

5. Cart (`/cart`) with average score 98\
![Screen Shot 2023-07-29 at 19 14 24](https://github.com/ashnchiquita/single_service/assets/88751131/c365008f-b010-442a-a2b9-813b753d66a5)

6. Orders (`/order`) with average score 98\
![Screen Shot 2023-07-29 at 19 15 11](https://github.com/ashnchiquita/single_service/assets/88751131/285a9f71-3769-457f-a76a-839cdd5fe888)

## B06 - Responsive Layout
KolMart frontend is built responsive.

## B07 - API Documentation
API documentation for single service can be accessed [here](https://app.swaggerhub.com/apis/16521248/ohl_single_service/1). API documentation for monolith can be accessed [here](https://app.swaggerhub.com/apis/16521248/ohl_monolith/1).

## B11 - Additional Features
1. Logout
2. Cart

## B12 - FE Admin Bug Fix
- fix: change replace query to set query in barang filter (#3)
