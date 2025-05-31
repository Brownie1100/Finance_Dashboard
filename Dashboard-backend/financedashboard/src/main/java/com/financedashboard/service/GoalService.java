package com.financedashboard.service;

import java.util.List;

import com.financedashboard.entities.Goal;

public interface GoalService {
    List<Goal> getAllGoal();
    List<Goal> getGoalByUserId(Long userId);
    Goal saveGoal(Goal goal);
    Goal updateGoal(Long id, Goal goal);
    void deleteGoal(Long id);
}
