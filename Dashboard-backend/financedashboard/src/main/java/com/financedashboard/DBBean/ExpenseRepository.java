package com.financedashboard.DBBean;

import com.financedashboard.entities.Expense;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> getExpenseByUserId(Long userId);
}
