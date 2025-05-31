package com.financedashboard.controller;

import com.financedashboard.entities.Goal;
import com.financedashboard.service.GoalService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goal")
public class GoalController {
    // Inject the GoalService here
    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }
    @GetMapping
    public List<Goal> getAllGoals() {
        return goalService.getAllGoal();
    }
    @GetMapping("/{userId}")
    public List<Goal> getGoalsByUserId(@PathVariable Long userId) {
        return goalService.getGoalByUserId(userId);
    }
    @PostMapping
    public Goal createGoal(@RequestBody Goal goal) {
        return goalService.saveGoal(goal);
    }
    @PutMapping("/{id}")
    public Goal updateGoal(@PathVariable Long id, @RequestBody Goal goal) {
        return goalService.updateGoal(id, goal);
    }
    @DeleteMapping("/{id}")
    public void deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
    }
        
}   
