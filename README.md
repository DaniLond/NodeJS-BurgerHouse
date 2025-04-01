🍔 NodeJS-BurgerHouse

Members: 

- Leidy Daniela Londoño- A00392917
- Isabella Huila - A00394751

Burger House 

Context of the Problem: Burger House is a restaurant specialized in hamburgers that seeks to optimize order management and improve the customer experience. Currently, the lack of an integrated system generates inefficiencies such as delays in order preparation, communication errors between staff and customers, and a less than seamless shopping experience. This project aims to solve these problems through a centralized platform that allows customers to browse the menu, customize their orders, place orders quickly, and track their status in real time. In addition, it provides efficient tools for managers and delivery drivers, improving internal management and reducing delivery times.

Target Audience:

Customers: Those looking for a fast and hassle-free ordering experience.

Restaurant managers: Need to optimize order management and delivery times.

Delivery drivers: Require an organized system for receiving and completing deliveries, updating order status.


How to run the project??

1. clone the repository
```sh
   git clone https://github.com/DaniLond/NodeJS-BurgerHouse
   cd NodeJs-BurgerHouse
```
2. install the dependencies
```sh
  npm install
```

3. Compile the code
```sh
  npm run dev
```
4. Run the tests
   
  First install jest
  ```sh
  npm install --save-dev jest ts-jest @types/jest typescript  
```
Then run the tests
```sh
  npm run test 
```

# Endpoints de la API

## Users

- **GET** `/users/`  
- **POST** `/users/create`  
- **POST** `/users/login`  
- **PUT** `/users/update/:email`  
- **DELETE** `/users/delete/:email`

## Products
- **GET** `/products/`  
- **POST** `/products/create`  
- **PUT** `/products/update/:name`  
- **DELETE** `/products/delete/:name`


## Orders
- **POST** `/orders/`  
- **GET** `/orders/`  
- **GET** `/orders/:id`  
- **PUT** `/orders/:id`  
- **DELETE** `/orders/:id`  
- **PATCH** `/orders/status/:id`








