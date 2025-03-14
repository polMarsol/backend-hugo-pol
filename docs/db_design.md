# 📜 Database design and UML

## 1️⃣ Introduction 
This document describes the system structure based on a **UML Class Diagram**, detailing the main entities, their attributes, and relationships. The **Virtual REC.0** project is a digital adaptation of the REC.0 of Igualada, an event focused on transforming old industrial areas into creative and commercial spaces. This virtual version aims to bring the unique shopping experience of REC.0 to an online platform (e-commerce), allowing users to explore shops, purchase products, and interact within a structured digital marketplace.

---

## 2️⃣ Justificación del UML  
The UML diagram represents the project requirements according to the statement, organizing the system into **users, shops, products, and orders**. Below is an explanation of each part of the design:

### **👤 User Model (`User`)**  
- **Reason:** Centralizes common information for different user types. 
- **Roles:**  
  - `Admin`: Manages the system, creates shops and salespeople.  
  - `Salesperson`: Manages their own shops and products.
  - `Shopper`: Buys products and places orders.  
- **Main methods:**  
  - `signIn()` and `signOut()` for authentication.  
  - `updateData()` in order to update the profile.  

---

### **🏪 Shop Model (`Shop`)**  
- **Motivo:** Represents the shop within the system. 
- **Main properties:**  
  - `name`, `description`, `categories` (shop classification).  
- **Relationships:**  
  - Each shop belongs to a `Salesperson`.  
  - It can contain multiple `Product` instances.  

---

### **📦 Product Model (`Product`)**  
- **Reason:** Allows salespeople to manage their products. 
- **Properties:**  
  - `name`, `description`, `price`, `size`, `images`.  
- **Relationships:**  
  - Belongs to a single `Shop`.  
  - Can receive multiple `Review` instances.  

---

### **📜 Order Model (`Order`)**  
- **Reason:** Represents an order placed by a `Shopper`.  
- **Properties:**  
  - `address`: Uses the `Address` class instead of just a string.  
  - `status`: Represents the order status.  
- **Methods:**  
  - `updateStatus()`: Changes the order status.
  - `cancelOrder()`: Allows order cancellation if not yet shipped. 
- **Relationships:**  
  - A `Shopper` can place multiple orders.  
  - Each `Order` can contain several `Product` instances.  
  - It is linked to a `Shop`, ensuring products come from the same store.  

---

### **📍 Address Model (`Address`)**  
- **Reason:** Allows shoppers to save multiple delivery addresses. 
- **Relationship:**  
  - A `Shopper` can have multiple `Address` instances.  

---

### **⭐ Review Model (`Review`)**  
- **Motivo:** Allows shoppers to rate products and shops. 
- **Properties:**  
  - `rating`: Score from 1 to 5.  
  - `comment`: User opinion.  
  - `date`: Date of the review.  
- **Relationships:**  
  - A `Shopper` can write multiple `Review` instances.  
  - A `Product` or `Shop` can have many reviews.  

---

## 3️⃣ 📌 UML Relationships
- `User <|-- Admin`, `User <|-- Salesperson`, `User <|-- Shopper`: Inheritance from the `User` class because all are types of User.  
- `Admin "1" -- "1..N" Salesperson`: An admin can create multiple salespeople. 
- `Salesperson "1" -- "1..N" Shop`: A salesperson manages one or more shops.
- `Shop "1" -- "0..N" Product`: A shop sells multiple products.
- `Shopper "1" -- "0..N" Order`: A shopper can place multiple orders.
- `Order "1" -- "1..N" Product`: An order can contain multiple products.
- `Shopper "1" -- "0..N" Address`: A shopper can register several addresses.
- `Shopper "1" -- "0..N" Review`: A shopper can write multiple reviews.

---

## 4️⃣ 🔹 UML Class Diagram
```mermaid
%%{init: {'theme':'neutral'}}%%
classDiagram
    direction TB
    
    class User {
        +name: String
        +username: String
        +password: String
        +email: String
        +role: String
        +signIn(username, password): User
        +signOut(): Boolean
        +updateData(currentPassword, newName, newEmail, newPassword): Boolean

    }
    
    class Admin {
        +createSalesperson(name, username, email, password, role): User
        +createAdmin(name, username, email, password, role): User
        +createShop(ownerId, shopName, description, categories): Shop
        +deleteShop(shopId): Boolean

    }
    
    class Salesperson {
        +listShops(): List<Shop>
        +listProducts(shopId): List<Product>
        +createProduct(shopId, name, description, price, size, images): Product
        +updateProduct(productId, newName, newDescription, newPrice, newSize, newImages): Boolean
        +deleteProduct(productId): Boolean
        +listOrders(shopId): List<Order>
        +updateOrderStatus(orderId, newStatus): Boolean
        +updateShop(shopId, newName, newDescription, newCategories): Boolean
    }
    
    class Shopper {
        +signUp(name, username, email, password): Boolean
        +browseShops(): List<Shop>
        +browseProducts(shopId): List<Product>
        +placeOrder(shopId, productList, address): Order
        +listOrders(): List<Order>
        +addAddress(street, city, zipCode, country): Boolean
        +removeAddress(addressId): Boolean
        +listAddresses(): List<Address>
    }

    class Address {
        +street: String
        +city: String
        +zipCode: String
        +country: String
    }

    class Shop {
        +name: String
        +description: String
        +categories: List<String>
    }

    class Product {
        +name: String
        +description: String
        +images: List<String>
        +price: Float
        +size: String
    }

    class Order {
        +address: String
        +status: String
        +updateStatus(String): Boolean
        +cancelOrder(): Boolean
    }

    class Review {
    +rating: Int
    +comment: String
    +date: Date
}

    
    %% Relaciones entre clases
    User <|-- Admin
    User <|-- Salesperson
    User <|-- Shopper

    Admin "1" -- "1..N" Salesperson: creates >
    Salesperson "1" -- "1..N" Shop: owns >
    Shop "1" -- "0..N" Product: sells >
    Shopper "1" -- "0..N" Order: places >
    Order "1" -- "1..N" Product: contains >
    Shop "1" -- "0..N" Order: receives >
    Shopper "1" -- "0..N" Review: writes >
    Product "1" -- "0..N" Review: has >
    Shop "1" -- "0..N" Review: has >
    Shopper "1" -- "0..N" Address: has >
```




## 4️⃣ 🔹 UML Class Diagram
```mermaid
%%{init: {'theme':'neutral'}}%%
classDiagram
    direction TB
    
    class User {
        +id: String
        +name: String
        +username: String
        +password: String
        +email: String
        +role: Enum<String>
    }

    class Shop {
        +id: String
        +ownerId: String
        +name: String
        +description: String
        +categories: List<String>
    }

    class Product {
        +id: String
        +shopId: String
        +productDescriptionId: String
    }

    class ProductDescription {
        +id: String
        +name: String
        +description: String
        +images: List<String>
        +price: Float
        +size: String
    }

    class Order {
        +id: String
        +shopperId: String
        +shopId: String
        +address: String
        +status: Enum<String>
    }

    class OrderItem {
        +orderId: String
        +productId: String
        +quantity: Int
        +priceAtPurchase: Float
    }

    User "1" -- "1..N" Shop: manage >
    Product "1" -- "1" ProductDescription: has >
    Shop "1" -- "0..N" Product: sells >
    Shop "1" -- "0..N" Order: processes >
    Order "1" -- "1..N" OrderItem: contains >
    Product "1" -- "0..N" OrderItem: part of >
```



```mermaid
%%{init: {'theme':'neutral'}}%%
classDiagram
    direction TB

    class User {
        +id: INT
        +name: VARCHAR(255)
        +username: VARCHAR(255)
        +password: VARCHAR(255)
        +email: VARCHAR(255)
        +role: ENUM
    }

    class Shop {
        +id: INT
        +ownerId: INT
        +name: VARCHAR(255)
        +description: TEXT
    }

    class Category {
        +id: INT
        +name: VARCHAR(255)
    }

    class ShopCategory {
        +shopId: INT
        +categoryId: INT
    }

    class ProductDescription {
        +id: INT
        +name: VARCHAR(255)
        +description: TEXT
        +price: DECIMAL(10,2)
        +size: VARCHAR(50)
    }

    class Product {
        +id: INT
        +shopId: INT
        +productDescriptionId: INT
    }

    class ProductCategory {
        +productId: INT
        +categoryId: INT
    }

    class ProductImage {
        +id: INT
        +productId: INT
        +imageUrl: VARCHAR(255)
    }

    class OrderTable {
        +id: INT
        +shopperId: INT
        +shopId: INT
        +address: TEXT
        +status: ENUM
    }

    class OrderItem {
        +orderId: INT
        +productId: INT
        +quantity: INT
        +priceAtPurchase: DECIMAL(10,2)
    }

    %% Relaciones entre tablas
    User "1" -- "1..N" Shop: owns >
    Shop "1" -- "0..N" Product: sells >
    Product "1" -- "1" ProductDescription: describes >
    Shop "1" -- "0..N" OrderTable: processes >
    OrderTable "1" -- "1..N" OrderItem: contains >
    Product "1" -- "0..N" OrderItem: part of >
    Category "1" -- "0..N" ShopCategory: categorizes >
    Shop "1" -- "0..N" ShopCategory: belongsTo >
    Category "1" -- "0..N" ProductCategory: categorizes >
    Product "1" -- "0..N" ProductCategory: belongsTo >
    Product "1" -- "0..N" ProductImage: hasImage >

```