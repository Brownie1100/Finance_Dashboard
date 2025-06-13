package com.financedashboard.service;

import com.financedashboard.entities.Income;
import java.util.List;

public interface IncomeService {
    List<Income> getAllIncome();
    List<Income> getIncomeByUserId(Long userId);
    List<Income> saveIncome(List<Income> income);
    Income updateIncome(Long id, Income income);
    void deleteIncome(Long id);
    void deleteAllIncomes(List<Long> ids);
}
