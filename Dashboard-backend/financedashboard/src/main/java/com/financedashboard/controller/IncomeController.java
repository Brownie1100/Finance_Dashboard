package com.financedashboard.controller;

import com.financedashboard.entities.Income;
import com.financedashboard.service.IncomeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income")
public class IncomeController {
    private  final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @GetMapping
    public List<Income> getAllIncome() {
        return incomeService.getAllIncome();
    }

    @GetMapping("/{userId}")
    public List<Income> getIncome(@PathVariable Long userId) {
        return incomeService.getIncomeByUserId(userId);
    }

    @PostMapping
    public List<Income> createIncome(@RequestBody List<Income> income) {
        return incomeService.saveIncome(income);
    }

    @PutMapping("/{id}")
    public Income updateIncome(@PathVariable Long id, @RequestBody Income income) {
        return incomeService.updateIncome(id, income);
    }

    @DeleteMapping("/{id}")
    public void deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
    }
}
