package com.financedashboard.DBBean;

import com.financedashboard.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
     User findByEmail(String email); // This method retrieves a User entity by its email address.
     // The method name follows Spring Data JPA's naming conventions to automatically implement the query.
        // It will generate a query to find a User where the name matches the provided parameter.
        // No need to implement this method; Spring Data JPA will handle it automatically.
        // The return type is User, which means it will return a single User entity or null if no user is found.
        // The method is used in the UserServiceImpl class to retrieve a user by their name.
        // This interface is part of the data access layer and is used to interact with the database.        
}
// This interface extends JpaRepository, which provides CRUD operations for the User entity.