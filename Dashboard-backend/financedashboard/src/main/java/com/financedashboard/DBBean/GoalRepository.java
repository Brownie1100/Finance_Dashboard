package com.financedashboard.DBBean;

import org.springframework.data.jpa.repository.JpaRepository;
import com.financedashboard.entities.Goal;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {
     List<Goal> getGoalByUserId(Long userId);
}

