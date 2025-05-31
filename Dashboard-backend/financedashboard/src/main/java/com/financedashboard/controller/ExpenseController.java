package com.financedashboard.controller;

import com.financedashboard.entities.Expense;
import com.financedashboard.service.ExpenseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expense")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    @GetMapping("/{userId}")
    public List<Expense> getExpense(@PathVariable Long userId) {
        return expenseService.getExpenseByUserId(userId);
    }

    @PostMapping
    public List<Expense> createExpense(@RequestBody List<Expense> expense) {
        return expenseService.saveExpense(expense);
    }

    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        return expenseService.updateExpense(id, expense);
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
    }
}
