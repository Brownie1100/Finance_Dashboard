package com.financedashboard.DBBean;

import com.financedashboard.entities.Income;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface IncomeRepository extends JpaRepository<Income, Long> {
     List<Income> getIncomeByUserId(Long userId);
    // Additional query methods can be defined here if needed
    // For example, to find incomes by a specific attribute:
    // List<Income> findByCategory(String category);
    // Or to find incomes within a specific date range:
    // List<Income> findByDateBetween(LocalDate startDate, LocalDate endDate);
    // Note: JpaRepository already provides methods like findAll(), save(), deleteById(), etc.
    // You can also define custom query methods using Spring Data JPA's query derivation feature.
}
