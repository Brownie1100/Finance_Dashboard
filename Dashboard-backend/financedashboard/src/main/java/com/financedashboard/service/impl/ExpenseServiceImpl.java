package com.financedashboard.service.impl;

import com.financedashboard.entities.Expense;
import com.financedashboard.DBBean.ExpenseRepository;
import com.financedashboard.service.ExpenseService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Override
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    @Override
    public List<Expense> getExpenseByUserId(Long userId) {
        return expenseRepository.getExpenseByUserId(userId);
    }

    @Override
    public List<Expense> saveExpense(List<Expense> expense) {
        return expenseRepository.saveAll(expense);
    }

    @Override
    public Expense updateExpense(Long id, Expense expense) {
        Expense existing = expenseRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setCategory(expense.getCategory());
            existing.setAmount(expense.getAmount());
            existing.setDate(expense.getDate());
            return expenseRepository.save(existing);
        }
        return null;
    }

    @Override
    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}
