package com.financedashboard.service;

import com.financedashboard.entities.Expense;
import java.util.List;

public interface ExpenseService {
    List<Expense> getAllExpenses();
    List<Expense> getExpenseByUserId(Long userId);
    List<Expense> saveExpense(List<Expense> expense);
    Expense updateExpense(Long id, Expense expense);
    void deleteExpense(Long id);
    void deleteAllExpenses(List<Long> ids);
}
