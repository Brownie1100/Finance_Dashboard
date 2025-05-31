package com.financedashboard.service.impl;

import com.financedashboard.entities.Goal;

import java.util.List;

import com.financedashboard.DBBean.GoalRepository;
import com.financedashboard.service.GoalService;
import org.springframework.stereotype.Service;

@Service
public class GoalServiceImpl implements GoalService{

    public final GoalRepository goalRepository;
    public GoalServiceImpl(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

     @Override
    public List<Goal> getAllGoal() {
        return goalRepository.findAll();
    }

    @Override
    public List<Goal> getGoalByUserId(Long userId) {
        return goalRepository.getGoalByUserId(userId);
    }

    @Override
    public Goal saveGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    @Override
    public Goal updateGoal(Long id, Goal goal) {
        Goal existing = goalRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setCategory(goal.getCategory());
            existing.setAmount(goal.getAmount());
            existing.setStartDate(goal.getStartDate());
            existing.setEndDate(goal.getEndDate());
            return goalRepository.save(existing);
        }
        return null;
    }

    @Override
    public void deleteGoal(Long id) {
        goalRepository.deleteById(id);
    }

    

}
