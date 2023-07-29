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
2. Put seed data inside that file
3. Run `npx prisma db seed`

## Run Command
1. Run `npm i`
2. Create `.env` folder in root directory
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
1. Login (`/login`) with average score 95.5
![Screen Shot 2023-07-29 at 19 09 15](https://github.com/ashnchiquita/KolMart-Django/assets/88751131/165beebf-ad55-4e90-9c1d-9f727c91be48)

3. Register (`/register`) with average score 95.5
![Screen Shot 2023-07-29 at 19 08 09](https://github.com/ashnchiquita/KolMart-Django/assets/88751131/071da31e-a0da-490b-8671-da5cebec7fb7)

5. Store (`/store`) with average score 97.5
![Screen Shot 2023-07-29 at 19 09 55](https://github.com/ashnchiquita/KolMart-Django/assets/88751131/42e2520b-0f29-4d47-ad4a-3c32b684b413)

6. Product (`/product/{product_id}`) with average score 96.25
![Screen Shot 2023-07-29 at 19 10 37](https://github.com/ashnchiquita/KolMart-Django/assets/88751131/4352c3eb-4e7d-458f-9a05-12b5b2c09219)

8. Cart (`/cart`) with average score 98\
![Screen Shot 2023-07-29 at 19 14 24](https://github.com/ashnchiquita/KolMart-Django/assets/88751131/d557cd3b-0922-47f6-8033-27e89364ff89)

9. Orders (`/order`) with average score 98\
![Screen Shot 2023-07-29 at 19 15 11](https://github.com/ashnchiquita/KolMart-Django/assets/88751131/aaf71197-6e6d-4104-afc6-72976b760d68)

## B06 - Responsive Layout
KolMart frontend is built responsive.

## B07 - API Documentation
API documentation for single service can be accessed [here](https://app.swaggerhub.com/apis/16521248/ohl_single_service/1). API documentation for monolith can be accessed [here](https://app.swaggerhub.com/apis/16521248/ohl_monolith/1).

## B11 - Additional Features
1. Logout
2. Cart

## B12 - FE Admin Bug Fix
- fix: change replace query to set query in barang filter (#3)
