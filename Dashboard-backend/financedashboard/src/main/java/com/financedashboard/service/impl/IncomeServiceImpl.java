package com.financedashboard.service.impl;

import com.financedashboard.entities.Income;
import com.financedashboard.DBBean.IncomeRepository;
import com.financedashboard.service.IncomeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncomeServiceImpl implements IncomeService {

    private final IncomeRepository incomeRepository;

    public IncomeServiceImpl(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }

    @Override
    public List<Income> getAllIncome() {
        return incomeRepository.findAll();
    }

    @Override
    public List<Income> getIncomeByUserId(Long userId) {
        return incomeRepository.getIncomeByUserId(userId);
    }

    @Override
    public List<Income> saveIncome(List<Income> income) {
        return incomeRepository.saveAll(income);
    }

    @Override
    public Income updateIncome(Long id, Income income) {
        Income existing = incomeRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setCategory(income.getCategory());
            existing.setAmount(income.getAmount());
            existing.setDate(income.getDate());
            existing.setDescription(income.getDescription());
            return incomeRepository.save(existing);
        }
        return null;
    }

    @Override
    public void deleteIncome(Long id) {
        incomeRepository.deleteById(id);
    }
    @Override
    public void deleteAllIncomes(List<Long> ids) {
        incomeRepository.deleteAllById(ids);
    }
}
