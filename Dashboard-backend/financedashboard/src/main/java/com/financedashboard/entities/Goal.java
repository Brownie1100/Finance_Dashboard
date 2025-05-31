package com.financedashboard.entities;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "GoalsTracker")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String category;
    private Double amount;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private String type;
    
    public Goal() {}
    public Goal(Long userId, String category, Double amount, LocalDate startDate, LocalDate endDate, String description,String type) {
        this.userId = userId;
        this.category = category;
        this.amount = amount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
        this.type = type;
    }

    @Override
    public String toString() {
        return "Goal [UserId=" + userId + ", category=" + category + ", amount=" + amount + ", startDate=" + startDate + ", endDate=" + endDate + "description=" + description + " type=" + type + "]";
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }
    public Double getAmount() {
        return amount;
    }
    public void setAmount(Double amount) {
        this.amount = amount;
    }
    public LocalDate getStartDate() {
        return startDate;
    }
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    public LocalDate getEndDate() {
        return endDate;
    }
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

}
