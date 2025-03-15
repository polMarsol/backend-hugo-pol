# Project documentation

Place your documentation in this folder.

It can be in `pdf` or `markdown` format.


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

    



